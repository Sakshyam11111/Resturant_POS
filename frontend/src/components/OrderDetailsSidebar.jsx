'use client';

import React from 'react';
import {
    X, ChevronDown, Minus, Plus, Trash2, Edit, Notebook,
    ShoppingCart, Printer
} from 'lucide-react';

const PRIMARY_BLUE = '#3673B4';

const OrderDetailsSidebar = ({
    // States
    showRightSidebar,
    setShowRightSidebar,
    orderType,
    setOrderType,
    showTakeaway,
    setShowTakeaway,
    showQuickBill,
    setShowQuickBill,       
    table,
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
}) => {
    return (
        <div
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-gray-200 flex flex-col transition-transform md:relative md:translate-x-0 md:w-96 ${
                showRightSidebar ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="p-4 md:p-6 space-y-4 md:space-y-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Order Details</h2>
                    <button onClick={() => setShowRightSidebar(false)} className="md:hidden">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Dine-in / Takeaway / Quick Bill Tabs */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => {
                            setOrderType('dine-in');
                            setShowTakeaway(false);
                            setShowQuickBill(false);
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                            orderType === 'dine-in' && !showTakeaway && !showQuickBill
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
                        className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                            showTakeaway ? 'bg-white border-2 border-blue-500 text-blue-600 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                        className="flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    >
                        Quick Bill
                    </button>
                </div>

                {/* Order Info */}
                <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Order ID</span>
                        <span className="font-bold text-gray-900">PR3004</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Table</span>
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-gray-900">{table}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Order Items List */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-900 text-sm md:text-base">Order Items</h3>
                        {currentOrderItems.length > 0 && (
                            <button onClick={clearOrder} className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Clear All
                            </button>
                        )}
                    </div>

                    {currentOrderItems.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-xs md:text-sm">No items added</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {currentOrderItems.map(item => (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-gray-900 text-sm md:text-base flex-1">{item.name}</h4>
                                        <div className="flex items-center gap-1 ml-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditForm(item);
                                                }}
                                                className="p-1 text-blue-600 transition-colors"
                                                title="Edit item"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openNoteForm(item);
                                                }}
                                                className="p-1 text-blue-600 transition-colors"
                                                title="Add note"
                                            >
                                                <Notebook className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeItem(item.id);
                                                }}
                                                className="p-1 text-red-500 transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateQuantity(item.id, -1);
                                                }}
                                                className="px-2 py-1 text-red-600 hover:bg-gray-100"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-3 py-1 border-l border-r border-gray-300 text-sm font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateQuantity(item.id, 1);
                                                }}
                                                className="px-2 py-1 text-blue-600 hover:bg-gray-100"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="font-bold text-blue-800 text-sm md:text-base">
                                            Rs. {(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>

                                    {item.note && (
                                        <div className="mt-2 p-2 bg-blue-50 rounded-md text-xs text-gray-700">
                                            <span className="font-medium">Note:</span> {item.note}
                                        </div>
                                    )}

                                    {item.extras?.length > 0 && (
                                        <div className="mt-2 p-2 bg-green-50 rounded-md text-xs text-gray-700">
                                            <span className="font-medium">Extras:</span>{' '}
                                            {item.extras
                                                .map(id => availableExtras.find(e => e.id === id)?.name)
                                                .filter(Boolean)
                                                .join(', ')}
                                        </div>
                                    )}

                                    {item.removals?.length > 0 && (
                                        <div className="mt-2 p-2 bg-red-50 rounded-md text-xs text-gray-700">
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

                {/* Summary & Actions */}
                {currentOrderItems.length > 0 && (
                    <div className="p-4 md:p-1 border-t border-gray-200 space-y-3 md:space-y-4 bg-gray-50 text-xs md:text-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal :</span>
                                <span className="font-medium text-gray-900">Rs {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax (13%) :</span>
                                <span className="font-medium text-gray-900">Rs {tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Discount</span>
                                <span className="font-medium text-gray-900">Rs {currentDiscount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="text-lg md:text-xl font-bold" style={{ color: PRIMARY_BLUE }}>
                                    Rs {total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 md:gap-3">
                            <button
                                style={{ backgroundColor: PRIMARY_BLUE }}
                                className="flex-1 py-2.5 md:py-3 rounded-lg text-white font-semibold hover:opacity-90 text-xs md:text-sm"
                            >
                                Send to Kitchen
                            </button>
                            <button
                                onClick={clearOrder}
                                className="flex-1 py-2.5 md:py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 text-xs md:text-sm"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsSidebar;