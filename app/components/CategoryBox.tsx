import React from 'react';

const CategoryBox = () => {
  const categories = [
    {
      title: 'Gaming',
      description: 'Games, consoles, accessories',
      image: '/images/gaming.png',
    },
    {
      title: 'Figurines',
      description: 'Action figures, minis, accessories',
      image: '/images/figurines.png',
    },
    {
      title: 'Trading Cards',
      description: 'Booster packs, single cards, boxes',
      image: '/images/cards.png',
    },
    {
      title: 'Electronics',
      description: 'Cell phones, tablets, laptops',
      image: '/images/electronics.png',
    },
    {
      title: 'Toys',
      description: 'Plushies, building blocks, dolls',
      image: '/images/toys.png',
    },
    {
      title: 'Beauty',
      description: 'Fragrance, makeup, accessories',
      image: '/images/beauty.png',
    },
    {
      title: 'Handbags',
      description: 'Authentic, designer, trend',
      image: '/images/handbags.png',
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
          <img
            src={cat.image}
            alt={cat.title}
            className="w-full h-32 object-contain mt-4"
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryBox;
