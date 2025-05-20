import React from 'react';

const brands = [
  { name: 'Apple', image: '/brands/apple.png' },
  { name: 'Sony', image: '/brands/sony.png' },
  { name: 'Nike', image: '/brands/nike.png' },
  { name: 'Nintendo', image: '/brands/nintendo.png' },
  { name: 'Funko', image: '/brands/funko.png' },
  { name: 'Pokemon', image: '/brands/pokemon.png' },
];

const TopBrandsCarousel = () => {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Top brands</h2>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {brands.map((brand, index) => (
          <div key={index} className="flex flex-col items-center min-w-[100px]">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center shadow">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-14 h-14 object-contain"
              />
            </div>
            <p className="mt-2 text-sm font-medium">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBrandsCarousel;
