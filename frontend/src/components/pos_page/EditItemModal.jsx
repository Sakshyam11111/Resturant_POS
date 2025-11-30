import React from 'react';
import { X } from 'lucide-react';

const PRIMARY_BLUE = '#3673B4';

const EditItemModal = ({
  showEditForm,
  setShowEditForm,
  currentEditItem,
  availableExtras,
  availableRemovals,
  selectedExtras,
  setSelectedExtras,
  selectedRemovals,
  setSelectedRemovals,
  saveEdit
}) => {
  if (!showEditForm || !currentEditItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Item</h3>
          <button onClick={() => setShowEditForm(false)} className="text-red-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-5 text-sm">
          <div>
            <h4 className="font-medium mb-2">Extras</h4>
            {availableExtras.map(e => (
              <label key={e.id} className="flex items-center gap-2 mb-1.5">
                <input
                  type="checkbox"
                  checked={selectedExtras.includes(e.id)}
                  onChange={(ev) => setSelectedExtras(prev =>
                    ev.target.checked ? [...prev, e.id] : prev.filter(id => id !== e.id)
                  )}
                  className="rounded"
                />
                <span>{e.name} {e.price > 0 && `(Rs. ${e.price})`}</span>
              </label>
            ))}
          </div>
          <div>
            <h4 className="font-medium mb-2">Remove</h4>
            {availableRemovals.map(r => (
              <label key={r.id} className="flex items-center gap-2 mb-1.5">
                <input
                  type="checkbox"
                  checked={selectedRemovals.includes(r.id)}
                  onChange={(ev) => setSelectedRemovals(prev =>
                    ev.target.checked ? [...prev, r.id] : prev.filter(id => id !== r.id)
                  )}
                  className="rounded"
                />
                <span>{r.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={() => setShowEditForm(false)} className="flex-1 py-2.5 bg-gray-200 rounded-lg text-gray-700 font-medium">
            Cancel
          </button>
          <button onClick={saveEdit} style={{ backgroundColor: PRIMARY_BLUE }} className="flex-1 py-2.5 text-white rounded-lg font-medium">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;