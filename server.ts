import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3000;

// Initialize Gemini client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-4-hydrogen';

// Zod schemas for input validation
const businessProfileSchema = z.object({
  businessName: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  productsOrServices: z.string().optional(),
  targetAudience: z.string().optional(),
  location: z.string().optional(),
  preferredTone: z.string().optional(),
  brandWords: z.string().optional(),
  avoidWords: z.string().optional(),
}).optional();

const generateRequestSchema = z.object({
  task: z.enum(['caption', 'description', 'whatsapp', 'ad-copy', 'calendar']),
  businessProfile: businessProfileSchema,
  input: z.record(z.string(), z.any()),
  variationInstruction: z.string().optional(),
});

function buildSystemInstruction(profile?: z.infer<typeof businessProfileSchema>) {
  let instruction = `You are Contentmate, an expert marketing and content writing assistant for small businesses, vendors, and creators.
Rules for your writing:
1. Be clear, professional, natural, and platform-appropriate. Avoid robotic tone, excessive emojis, exclamation marks, or over-the-counter hype.
2. Factual Integrity: Treat user-supplied details as the absolute source of truth. NEVER invent prices, discounts, ingredients, materials, dimensions, certifications, testimonials, delivery terms, scarcity, guarantees, or outcomes. If a detail is missing, omit it gracefully.
3. Respect tone preferences and avoid prohibited words.
4. Output valid JSON matching the requested schema exactly.`;

  if (profile) {
    instruction += `\n\nBusiness Context:`;
    if (profile.businessName) instruction += `\nBusiness Name: ${profile.businessName}`;
    if (profile.category) instruction += `\nCategory: ${profile.category}`;
    if (profile.description) instruction += `\nDescription: ${profile.description}`;
    if (profile.productsOrServices) instruction += `\nProducts/Services: ${profile.productsOrServices}`;
    if (profile.targetAudience) instruction += `\nDefault Audience: ${profile.targetAudience}`;
    if (profile.preferredTone) instruction += `\nPreferred Tone: ${profile.preferredTone}`;
    if (profile.brandWords) instruction += `\nBrand Vocabulary to use: ${profile.brandWords}`;
    if (profile.avoidWords) instruction += `\nWords/Claims to avoid: ${profile.avoidWords}`;
  }

  return instruction;
}

function getTaskPrompt(task: string, input: any, variationInstruction?: string) {
  let prompt = '';
  switch (task) {
    case 'caption':
      prompt = `Create a social media caption based on the following details:
- What the post is about: ${input.topic || ''}
- Platform: ${input.platform || 'Instagram'}
- Objective: ${input.objective || 'Promote'}
- Target Audience: ${input.audience || input.businessProfile?.targetAudience || 'General'}
- Tone: ${input.tone || input.businessProfile?.preferredTone || 'Friendly and professional'}
- Length: ${input.length || 'Medium'}
- Call to Action: ${input.callToAction || 'None specified'}
- Facts/Offers/Details to include: ${input.details || 'None'}
- Hashtags requirement: ${input.includeHashtags !== false ? 'Include hashtags separately' : 'Do not include hashtags'}`;
      break;

    case 'description':
      prompt = `Create a product or service description based on the following details:
- Name: ${input.name || ''}
- What it is / Service provided: ${input.whatItIs || ''}
- Key features/details: ${input.features || ''}
- Intended Customer: ${input.audience || 'General'}
- Where it will be used: ${input.useCase || 'Online store'}
- Length: ${input.length || 'Medium'}
- Tone: ${input.tone || 'Clear and professional'}
- Price: ${input.price || 'Not specified'}
- Delivery/Location/Availability: ${input.availability || 'Not specified'}`;
      break;

    case 'whatsapp':
      prompt = `Create a WhatsApp business message based on the following details:
- Purpose: ${input.purpose || 'New product/service'}
- Message Details: ${input.details || ''}
- Audience: ${input.audience || 'Customers'}
- Format: ${input.format || 'Broadcast'}
- Tone: ${input.tone || 'Warm and respectful'}
- Call to Action: ${input.callToAction || ''}
- Offer/Deadline: ${input.offer || 'None'}`;
      break;

    case 'ad-copy':
      prompt = `Create ad copy based on the following details:
- Product or Service: ${input.product || ''}
- What is being promoted: ${input.promotion || ''}
- Target Audience: ${input.audience || ''}
- Objective: ${input.objective || 'Sales'}
- Platform: ${input.platform || 'Facebook/Instagram'}
- Offer or Price: ${input.offer || 'None'}
- Desired Action: ${input.action || 'Visit website'}
- Tone: ${input.tone || 'Persuasive but natural'}`;
      break;

    case 'calendar':
      prompt = `Create a weekly content calendar plan with ${input.frequency || 5} days based on:
- Platform: ${input.platform || 'Instagram'}
- Main Goal for the Week: ${input.goal || 'Engagement'}
- Target Audience: ${input.audience || 'General'}
- Tone: ${input.tone || 'Friendly and professional'}
- Important Dates/Offers: ${input.events || 'None'}`;
      break;
  }

  if (variationInstruction) {
    prompt += `\n\nVARIATION INSTRUCTION: Please revise the output according to this instruction while maintaining all factual constraints: "${variationInstruction}"`;
  }

  return prompt;
}

function getTaskSchema(task: string) {
  switch (task) {
    case 'caption':
      return {
        type: Type.OBJECT,
        properties: {
          caption: { type: Type.STRING, description: 'The primary main caption text.' },
          hook: { type: Type.STRING, description: 'Alternative opening hook or line.' },
          callToAction: { type: Type.STRING, description: 'Suggested call to action wording.' },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of relevant hashtags without # symbol.' },
          notes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Optional short notes or tips.' },
        },
        required: ['caption', 'hashtags'],
      };
    case 'description':
      return {
        type: Type.OBJECT,
        properties: {
          mainDescription: { type: Type.STRING, description: 'Comprehensive product or service description.' },
          shortDescription: { type: Type.STRING, description: 'Concise summary description.' },
          features: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Bullet points of verified key features.' },
          callToAction: { type: Type.STRING, description: 'Call to action for the description.' },
          notes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Optional notes.' },
        },
        required: ['mainDescription', 'shortDescription'],
      };
    case 'whatsapp':
      return {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING, description: 'Ready-to-send WhatsApp message.' },
          shorterVersion: { type: Type.STRING, description: 'Shorter alternative version.' },
          openingLine: { type: Type.STRING, description: 'Friendly opening greeting line.' },
        },
        required: ['message'],
      };
    case 'ad-copy':
      return {
        type: Type.OBJECT,
        properties: {
          headlines: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Two compelling headline options.' },
          primaryText: { type: Type.STRING, description: 'Main ad body text.' },
          alternativeText: { type: Type.STRING, description: 'Concise alternative ad text.' },
          callToAction: { type: Type.STRING, description: 'Call to action button label.' },
          creativeAngle: { type: Type.STRING, description: 'Suggested visual or creative angle description.' },
        },
        required: ['headlines', 'primaryText', 'alternativeText', 'callToAction'],
      };
    case 'calendar':
      return {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Weekly calendar title or theme.' },
          platform: { type: Type.STRING, description: 'Primary platform.' },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayLabel: { type: Type.STRING, description: 'Day label e.g., Monday or Day 1.' },
                contentPillar: { type: Type.STRING, description: 'Purpose or pillar of the day.' },
                format: { type: Type.STRING, description: 'Content format e.g., Carousel, Reel, Story, Text.' },
                topic: { type: Type.STRING, description: 'Specific topic or angle.' },
                draft: { type: Type.STRING, description: 'Draft caption or concise outline.' },
                callToAction: { type: Type.STRING, description: 'Optional CTA.' },
              },
              required: ['dayLabel', 'contentPillar', 'format', 'topic', 'draft'],
            },
            description: 'List of planned content days.',
          },
        },
        required: ['title', 'platform', 'days'],
      };
    default:
      return {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
        },
        required: ['content'],
      };
  }
}

app.post('/api/content/generate', async (req, res) => {
  try {
    const parseResult = generateRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: parseResult.error.message },
      });
    }

    const { task, businessProfile, input, variationInstruction } = parseResult.data;

    const systemInstruction = buildSystemInstruction(businessProfile);
    const prompt = getTaskPrompt(task, input, variationInstruction);
    const responseSchema = getTaskSchema(task);

    const geminiRes = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema as any,
      },
    });

    const text = geminiRes.text;
    if (!text) {
      throw new Error('Empty response from AI model.');
    }

    const data = JSON.parse(text);
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error('Generation error:', error);
    const status = error.status || 500;
    const message = error.message || 'An error occurred during content generation.';
    return res.status(status).json({
      success: false,
      error: { code: 'GENERATION_ERROR', message },
    });
  }
});

app.post('/api/content/variation', async (req, res) => {
  // Uses the same generate endpoint logic with variationInstruction
  return app._router.handle(Object.assign(req, { url: '/api/content/generate' }), res, () => {});
});

// Setup Vite middleware in development or serve static in production
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Contentmate server running on http://localhost:${PORT}`);
});
