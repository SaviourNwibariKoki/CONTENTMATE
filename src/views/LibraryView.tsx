import React, { useState } from 'react';
import { SavedContent, ContentTaskType } from '../types';
import { getStoredLibrary, deleteFromLibrary, updateInLibrary } from '../lib/storage';
import { 
  Bookmark, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  Edit3, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

interface LibraryViewProps {
  onOpenCreate: (task: ContentTaskType) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onOpenCreate }) => {
  const [library, setLibrary] = useState<SavedContent[]>(getStoredLibrary());
  const [search, setSearch] = useState('');
  const [filterTask, setFilterTask] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<SavedContent | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  const filteredLibrary = library.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(item.content).toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterTask === 'all' || item.task === filterTask;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    deleteFromLibrary(id);
    setLibrary(getStoredLibrary());
    setDeleteConfirmId(null);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleCopyContent = (content: any, id: string) => {
    const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveEdit = () => {
    if (!selectedItem) return;
    updateInLibrary(selectedItem.id, { title: editTitle });
    setLibrary(getStoredLibrary());
    setSelectedItem({ ...selectedItem, title: editTitle });
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#315B4C] bg-[#E4EEE8] px-2.5 py-1 rounded-full mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Drafts</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#20251F]">Content library</h1>
          <p className="text-xs text-[#687067] mt-1">
            Revisit, search, copy, edit, or remove your saved marketing drafts.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#DADDD5] shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#687067] absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drafts by title or text..."
            className="w-full pl-9 pr-4 py-2 rounded-md border border-[#DADDD5] text-sm text-[#20251F] focus:outline-none focus:border-[#315B4C]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'caption', 'description', 'whatsapp', 'ad-copy', 'calendar'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterTask(t)}
              className={`px-3 py-1.5 rounded text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                filterTask === t
                  ? 'bg-[#315B4C] text-white'
                  : 'bg-[#EFEFE9] text-[#687067] hover:text-[#20251F]'
              }`}
            >
              {t === 'all' ? 'All types' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Library Grid */}
      {filteredLibrary.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#DADDD5] p-16 text-center space-y-4">
          <Bookmark className="w-12 h-12 text-[#687067]/30 mx-auto" />
          <div className="space-y-1">
            <h2 className="font-serif text-lg font-bold text-[#20251F]">No saved drafts found</h2>
            <p className="text-xs text-[#687067]">
              {library.length === 0 ? 'Your saved drafts will appear here once you save generated content.' : 'No drafts match your search or filter.'}
            </p>
          </div>
          {library.length === 0 && (
            <button
              onClick={() => onOpenCreate('caption')}
              className="px-4 py-2 bg-[#315B4C] hover:bg-[#25483C] text-white rounded-md text-xs font-medium shadow-sm transition-colors inline-block"
            >
              Create your first draft
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLibrary.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#DADDD5] p-6 hover:border-[#315B4C] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3 cursor-pointer" onClick={() => { setSelectedItem(item); setEditTitle(item.title); setIsEditing(false); }}>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#E4EEE8] text-[#315B4C]">
                    {item.task}
                  </span>
                  <span className="text-[11px] text-[#687067] flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#20251F] line-clamp-2 hover:text-[#315B4C] transition-colors">
                    {item.title}
                  </h3>
                  {item.platform && (
                    <span className="text-xs text-[#687067] mt-0.5 block">Platform: {item.platform}</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#DADDD5]/60 flex items-center justify-between">
                <button
                  onClick={() => { setSelectedItem(item); setEditTitle(item.title); setIsEditing(false); }}
                  className="px-3 py-1.5 bg-[#EFEFE9] hover:bg-[#DADDD5] text-[#20251F] rounded text-xs font-medium transition-colors"
                >
                  View draft
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyContent(item.content, item.id)}
                    className="p-1.5 text-[#687067] hover:text-[#315B4C] rounded transition-colors"
                    title="Copy content"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-[#367451]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 text-[#687067] hover:text-[#B33D35] rounded transition-colors"
                    title="Delete draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#DADDD5]">
            <div className="flex items-center space-x-3 text-[#B33D35]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-[#20251F]">Delete saved draft?</h3>
            </div>
            <p className="text-xs text-[#687067] leading-relaxed">
              This action cannot be undone. The saved draft will be permanently removed from your library.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium text-[#687067] hover:text-[#20251F]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-[#B33D35] hover:bg-[#962e28] text-white rounded text-xs font-medium shadow-sm transition-colors"
              >
                Delete draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Draft Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#DADDD5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DADDD5]/60 pb-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#E4EEE8] text-[#315B4C]">
                  {selectedItem.task}
                </span>
                <span className="text-xs text-[#687067]">{selectedItem.platform}</span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded text-[#687067] hover:text-[#20251F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <div className="flex items-center space-x-2 w-full pr-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded border border-[#DADDD5] p-1.5 text-sm font-serif font-bold text-[#20251F]"
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 bg-[#315B4C] text-white rounded text-xs font-medium whitespace-nowrap"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h2 className="font-serif text-xl font-bold text-[#20251F]">{selectedItem.title}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[#687067] hover:text-[#315B4C]"
                      title="Edit title"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Render Content based on task */}
              <div className="space-y-4 pt-2">
                {typeof selectedItem.content === 'string' ? (
                  <div className="p-4 bg-[#F7F7F3] rounded-lg border border-[#DADDD5] text-sm text-[#20251F] whitespace-pre-wrap">
                    {selectedItem.content}
                  </div>
                ) : (
                  <div className="space-y-4 text-sm text-[#20251F]">
                    {selectedItem.content.caption && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-[#687067] uppercase tracking-wider block">Caption</span>
                        <div className="p-4 bg-[#F7F7F3] rounded-lg border border-[#DADDD5] whitespace-pre-wrap">
                          {selectedItem.content.caption}
                        </div>
                      </div>
                    )}
                    {selectedItem.content.mainDescription && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-[#687067] uppercase tracking-wider block">Main Description</span>
                        <div className="p-4 bg-[#F7F7F3] rounded-lg border border-[#DADDD5] whitespace-pre-wrap">
                          {selectedItem.content.mainDescription}
                        </div>
                      </div>
                    )}
                    {selectedItem.content.message && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-[#687067] uppercase tracking-wider block">Message</span>
                        <div className="p-4 bg-[#F7F7F3] rounded-lg border border-[#DADDD5] whitespace-pre-wrap">
                          {selectedItem.content.message}
                        </div>
                      </div>
                    )}
                    {selectedItem.content.primaryText && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-[#687067] uppercase tracking-wider block">Primary Ad Text</span>
                        <div className="p-4 bg-[#F7F7F3] rounded-lg border border-[#DADDD5] whitespace-pre-wrap">
                          {selectedItem.content.primaryText}
                        </div>
                      </div>
                    )}
                    {selectedItem.content.days && (
                      <div className="space-y-3">
                        <span className="text-xs font-semibold text-[#687067] uppercase tracking-wider block">Weekly Plan Days</span>
                        {selectedItem.content.days.map((d: any, i: number) => (
                          <div key={i} className="p-3 bg-[#F7F7F3] rounded-md border border-[#DADDD5] space-y-1">
                            <div className="font-semibold text-xs text-[#315B4C]">{d.dayLabel} — {d.contentPillar} ({d.format})</div>
                            <div className="text-xs text-[#20251F] font-medium">{d.topic}</div>
                            <div className="text-xs text-[#687067]">{d.draft}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#DADDD5]/60">
              <button
                onClick={() => handleDelete(selectedItem.id)}
                className="text-xs font-medium text-[#B33D35] hover:underline flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete draft</span>
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleCopyContent(selectedItem.content, 'modal')}
                  className="px-4 py-2 bg-[#E4EEE8] text-[#315B4C] hover:bg-[#315B4C] hover:text-white rounded text-xs font-medium transition-colors flex items-center space-x-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'modal' ? 'Copied!' : 'Copy content'}</span>
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-[#315B4C] text-white rounded text-xs font-medium hover:bg-[#25483C]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
