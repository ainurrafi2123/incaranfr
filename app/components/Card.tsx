import React from 'react';

const Card = () => {
  return (
    <div className="w-[150px] bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-all">
      {/* Gambar Produk */}
      <div className="w-full h-[150px] bg-gray-100 flex items-center justify-center">
        <img
          src="https://via.placeholder.com/150"
          alt="Nama Produk"
          className="object-contain h-full"
        />
      </div>

      {/* Nama dan Harga */}
      <div className="p-2">
        <p className="text-sm text-gray-800 truncate">
          Kaos Kucing Oranye MUJI
        </p>
        <p className="text-sm font-semibold text-[#3c3c3c]">Rp 20.000,-</p>
      </div>
    </div>
  );
};

export default Card;
