import React from 'react';

const categories = [
  {
    title: 'Women',
    description: 'Blouses, dresses, and more',
    image: '/images/women.jpg',
  },
  {
    title: 'Men',
    description: 'Tees, polos, and more',
    image: '/images/men.jpg',
  },
  {
    title: 'Kids',
    description: 'Pajamas, outfits, and more',
    image: '/images/kids.jpg',
  },
  {
    title: 'Home',
    description: 'Decor, appliances, and more',
    image: '/images/home.jpg',
  },
];

const CategoryBannerGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {categories.map((cat, index) => (
        <div
          key={index}
          className="relative rounded-lg overflow-hidden shadow hover:shadow-lg transition"
        >
          <img
            src={cat.image}
            alt={cat.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white p-4">
            <p className="text-sm">{cat.description}</p>
            <h3 className="text-xl font-semibold">{cat.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryBannerGrid;
