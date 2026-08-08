'use client';

import React, { useState } from 'react';
import { Product } from '../data/products';
import { X, Star, ShoppingBag, Plus, Minus, Check } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCartWithOptions: (
    product: Product,
    quantity: number,
    selectedOptions: { spicyLevel: string; addOns: string[] }
  ) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToCartWithOptions,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [spicyLevel, setSpicyLevel] = useState('Không cay');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  if (!product) return null;

  const availableAddOns = [
    { name: 'Thêm phô mai Cheddar', price: 8000 },
    { name: 'Thêm trứng ốp la', price: 10000 },
    { name: 'Sốt BBQ khói', price: 5000 },
  ];

  const toggleAddOn = (name: string) => {
    if (selectedAddOns.includes(name)) {
      setSelectedAddOns(selectedAddOns.filter((item) => item !== name));
    } else {
      setSelectedAddOns([...selectedAddOns, name]);
    }
  };

  const addOnsTotal = selectedAddOns.reduce((sum, name) => {
    const item = availableAddOns.find((a) => a.name === name);
    return sum + (item ? item.price : 0);
  }, 0);

  const unitPrice = product.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Image */}
        <div className="relative h-64 w-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center p-6 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-48 h-48 object-cover rounded-full shadow-2xl border-4 border-white transform hover:scale-105 transition duration-300"
          />
          {product.discount > 0 && (
            <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
              GIẢM {product.discount}%
            </span>
          )}
          <span className="absolute bottom-4 right-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider shadow-lg">
            TriKun FastFood
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-xl font-extrabold text-slate-900">
                {product.name}
              </h2>
              <span className="text-xl font-black text-emerald-600">
                {formatVND(product.price)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1 text-yellow-500 font-bold">
                <Star className="w-4 h-4 fill-yellow-400" />
                {product.rating.toFixed(1)}
              </span>
              <span>•</span>
              <span>Đã bán {product.soldCount} suất</span>
            </div>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {product.description}
            </p>
          </div>

          {/* Option: Spicy level */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Mức độ cay
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Không cay', 'Cay vừa 🌶️', 'Siêu cay 🌶️🌶️'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSpicyLevel(level)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    spicyLevel === level
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Option: Add-ons */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Món ăn kèm (Tùy chọn)
            </label>
            <div className="space-y-2">
              {availableAddOns.map((item) => {
                const isChecked = selectedAddOns.includes(item.name);
                return (
                  <div
                    key={item.name}
                    onClick={() => toggleAddOn(item.name)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-50/60'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                          isChecked
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700">
                      +{formatVND(item.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition font-bold"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-extrabold text-slate-800 text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              onAddToCartWithOptions(product, quantity, {
                spicyLevel,
                addOns: selectedAddOns,
              });
              onClose();
            }}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Thêm vào giỏ ({formatVND(totalPrice)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
