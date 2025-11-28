'use client';

import React, { useState } from 'react';
import {
  X, ChevronDown, Minus, Plus, Trash2, Edit, Notebook,
  ShoppingCart, Printer, User
} from 'lucide-react';

const PRIMARY_BLUE = '#3673B4';
const NOTE_CHARACTER_LIMIT = 50;

const OrderDetailsSidebar = ({
  showRightSidebar,
  setShowRightSidebar,
  orderType,
  setOrderType,
  showTakeaway,
  setShowTakeaway,
  showQuickBill,
  setShowQuickBill,
  table,
  waiterName,
  waiters,
  currentOrderItems,
  currentDiscount,
  subtotal,
  tax,
  total,
  clearOrder,
  updateQuantity,
  removeItem,
  openEditForm,
  openNoteForm,
  availableExtras,
  availableRemovals,
  updateOrderWaiter,
  showNoteForm,
  setShowNoteForm,
  itemNote,
  setItemNote,
  saveNote,
}) => {
  const [showWaiterDropdown, setShowWaiterDropdown] = useState(false);

  const handleWaiterChange = (newWaiterId, newWaiterName) => {
    updateOrderWaiter(newWaiterId, newWaiterName);
    setShowWaiterDropdown(false);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 right-0 z-50 bg-white border-l border-gray-200 flex flex-col
          transition-transform duration-300 ease-in-out
          ${showRightSidebar ? 'translate-x-0' : 'translate-x-full'}
          ${'md:relative md:translate-x-0 md:w-96'}
          w-full sm:max-w-md
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4 sm:p-5 md:p-6 space-y-4 flex-1 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setShowRightSidebar(false)}
                className="p-1 rounded-lg hover:bg-gray-100 md:hidden"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <button
                onClick={() => {
                  setOrderType('dine-in');
                  setShowTakeaway(false);
                  setShowQuickBill(false);
                }}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-medium transition-all
                  ${orderType === 'dine-in' && !showTakeaway && !showQuickBill
                    ? 'bg-white border-2 border-blue-500 text-blue-600 shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Dine in
              </button>
              <button
                onClick={() => {
                  setOrderType('takeaway');
                  setShowTakeaway(true);
                  setShowQuickBill(false);
                }}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-medium transition-all
                  ${showTakeaway
                    ? 'bg-white border-2 border-blue-500 text-blue-600 shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Takeaway
              </button>
              <button
                onClick={() => {
                  setShowQuickBill(true);
                  setShowTakeaway(false);
                }}
                style={{ backgroundColor: PRIMARY_BLUE }}
                className="flex-1 py-2 px-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
              >
                Quick Bill
              </button>
            </div>

            {/* Order Info */}
            <div className="space-y-3 text-xs sm:text-sm bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-bold text-gray-900">PR3004</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Table</span>
                <span className="font-bold text-gray-900">{table}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Waiter</span>
                <div className="relative w-1/2">
                  <button
                    onClick={() => setShowWaiterDropdown(!showWaiterDropdown)}
                    className="w-full flex items-center justify-between bg-white border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm"
                  >
                    <span className="font-semibold text-gray-800 truncate pr-1">
                      {waiterName || 'Select Waiter'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  </button>
                  {showWaiterDropdown && (
                    <div className="absolute z-20 right-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {waiters.map((waiter) => (
                        <button
                          key={waiter.id}
                          onClick={() => handleWaiterChange(waiter.id, waiter.name)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs sm:text-sm flex items-center gap-2 transition"
                        >
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                          <span className="truncate">{waiter.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="flex-1 overflow-y-auto -mx-1 px-1">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Order Items</h3>
                {currentOrderItems.length > 0 && (
                  <button
                    onClick={clearOrder}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {currentOrderItems.length === 0 ? (
                <div className="text-center py-10 sm:py-12 text-gray-400">
                  <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-xs sm:text-sm">No items added</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentOrderItems.map(item => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base flex-1 pr-2">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditForm(item); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openNoteForm(item); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Note"
                          >
                            <Notebook className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-md text-xs sm:text-sm">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}
                            className="px-2 py-1.5 text-red-600 hover:bg-gray-100 transition"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <span className="px-3 py-1.5 border-l border-r border-gray-300 font-medium min-w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}
                            className="px-2 py-1.5 text-blue-600 hover:bg-gray-100 transition"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <p className="font-bold text-blue-800 text-sm sm:text-base">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {item.note && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-md text-xs text-gray-700 border border-blue-100">
                          <span className="font-medium">Note:</span> {item.note}
                        </div>
                      )}

                      {item.extras?.length > 0 && (
                        <div className="mt-2 p-2 bg-green-50 rounded-md text-xs text-gray-700 border border-green-100">
                          <span className="font-medium">Extras:</span>{' '}
                          {item.extras
                            .map(id => availableExtras.find(e => e.id === id)?.name)
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      )}

                      {item.removals?.length > 0 && (
                        <div className="mt-2 p-2 bg-red-50 rounded-md text-xs text-gray-700 border border-red-100">
                          <span className="font-medium">Removals:</span>{' '}
                          {item.removals
                            .map(id => availableRemovals.find(r => r.id === id)?.name)
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total & Actions */}
            {currentOrderItems.length > 0 && (
              <div className="border-t border-gray-200 pt-4 bg-gray-50 rounded-b-lg mt-auto">
                <div className="px-3 sm:px-4 pb-3 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (13%)</span>
                    <span className="font-medium">Rs {tax.toFixed(2)}</span>
                  </div>
                  {currentDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-red-600">-Rs {currentDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center px-3 sm:px-4 py-2 border-t border-gray-200">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg sm:text-xl font-bold" style={{ color: PRIMARY_BLUE }}>
                    Rs {total.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2 sm:gap-3 px-3 sm:px-4 pb-4 pt-2">
                  <button
                    style={{ backgroundColor: PRIMARY_BLUE }}
                    className="flex-1 py-2.5 sm:py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                    Send to Kitchen
                  </button>
                  <button
                    onClick={clearOrder}
                    className="flex-1 py-2.5 sm:py-3 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors text-xs sm:text-sm shadow-md"
                  >
                    Clear Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md p-4 sm:p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Add Item Note</h3>
              <button
                onClick={() => setShowNoteForm(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-red-500"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="mb-3">
              <textarea
                value={itemNote}
                onChange={(e) => {
                  if (e.target.value.length <= NOTE_CHARACTER_LIMIT) {
                    setItemNote(e.target.value);
                  }
                }}
                placeholder="Add cooking preferences, allergies..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                rows={4}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Max {NOTE_CHARACTER_LIMIT} characters</span>
                <span className={itemNote.length === NOTE_CHARACTER_LIMIT ? 'text-red-500 font-medium' : ''}>
                  {itemNote.length}/{NOTE_CHARACTER_LIMIT}
                </span>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowNoteForm(false)}
                className="flex-1 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                style={{ backgroundColor: PRIMARY_BLUE }}
                className="flex-1 py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition text-sm"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetailsSidebar;