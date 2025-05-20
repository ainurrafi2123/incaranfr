import React from 'react';

const Banner = () => {
  return (
    <div className="relative w-full h-[250px] bg-gradient-to-r from-purple-700 to-orange-400 rounded-lg overflow-hidden flex items-center px-6 text-white">
      {/* Kiri - Teks dan Tombol */}
      <div className="flex-1 z-10">
        <h1 className="text-3xl font-bold bg-red-500 inline-block px-3 py-1 rounded">
          INCARAN X SERUPUT
        </h1>
        <p className="mt-4 text-lg font-light">
          Discover millions of new listings <br />
          from Japan’s top brands
        </p>
        <button className="mt-4 px-4 py-2 bg-white text-blue-600 font-semibold rounded shadow hover:bg-blue-100 transition">
          Shop the drop
        </button>
      </div>

      {/* Kanan - Gambar Dekoratif */}
      <div className="flex gap-4 absolute right-4 bottom-4 z-0">
        <img
          src="https://via.placeholder.com/100"
          alt="item1"
          className="w-20 h-24 object-cover rotate-[10deg] rounded shadow-lg"
        />
        <img
          src="https://via.placeholder.com/100"
          alt="item2"
          className="w-20 h-24 object-cover rotate-[-5deg] rounded shadow-lg"
        />
        <img
          src="https://via.placeholder.com/100"
          alt="item3"
          className="w-20 h-24 object-cover rotate-[8deg] rounded shadow-lg"
        />
      </div>
    </div>
  );
};

export default Banner;
