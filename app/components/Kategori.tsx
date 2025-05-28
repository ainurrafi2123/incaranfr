import React from 'react';
import {
  Shirt,
  Smartphone,
  Gamepad2,
  Lamp,
  Baby,
  Palette,
  ClipboardList,
  PawPrint,
} from 'lucide-react';

const categories = [
  { icon: <Shirt size={24} />, label: 'Men' },
  { icon: <Smartphone size={24} />, label: 'Electronics' },
  { icon: <Gamepad2 size={24} />, label: 'Gaming' },
  { icon: <Lamp size={24} />, label: 'Home' },
  { icon: <Baby size={24} />, label: 'Kids' },
  { icon: <Palette size={24} />, label: 'Handmade' },
  { icon: <ClipboardList size={24} />, label: 'Office' },
  { icon: <PawPrint size={24} />, label: 'Pet' },
];

const Kategori = () => {
  return (
    <div className="flex flex-wrap gap-6 items-center justify-center py-6">
      {categories.map((cat, index) => (
        <div key={index} className="flex flex-col items-center text-sm text-gray-800 hover:text-black transition">
          <div className="mb-1">{cat.icon}</div>
          <span>{cat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Kategori;
