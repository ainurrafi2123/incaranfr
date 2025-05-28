import React from 'react';
import Image from 'next/image';

const CategoryBox = () => {
  const categories = [
    {
      title: 'Gaming',
      description: 'Games, consoles, accessories',
      image: '/gaming.jpg',
    },
    {
      title: 'Figurines',
      description: 'Action figures, minis, accessories',
      image: '/figurines.jpg',
    },
    {
      title: 'Trading Cards',
      description: 'Booster packs, single cards, boxes',
      image: '/trading.jpg',
    },
    {
      title: 'Electronics',
      description: 'Cell phones, tablets, laptops',
      image: '/electronic.jpg',
    },
    {
      title: 'Toys',
      description: 'Plushies, building blocks, dolls',
      image: '/toys.jpg',
    },
    {
      title: 'Beauty',
      description: 'Fragrance, makeup, accessories',
      image: '/beauty.jpg',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat, index) => (
        <div
          key={index}
          className="relative bg-blue-50 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-200"
        >
          <div>
            <p className="text-sm text-gray-600">{cat.description}</p>
            <h2 className="text-xl font-semibold mt-1">{cat.title}</h2>
            <p className="text-sm text-blue-600 font-medium mt-2">See more →</p>
          </div>
          <Image
            src={cat.image}
            alt={cat.title}
            width={300}       // Sesuaikan ukuran yang kamu mau
            height={130}
            className="w-full h-32 object-contain mt-4"
            priority={true}    // Opsional, supaya gambar langsung load
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryBox;
