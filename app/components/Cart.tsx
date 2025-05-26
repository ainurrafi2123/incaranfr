import React from "react";
import { ShoppingCart } from "lucide-react";

const Cart = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-600">
      <ShoppingCart className="w-16 h-16 mb-4" />
      <h1 className="text-xl font-semibold">Your cart is empty</h1>
      <p className="text-sm mt-2">Start adding items to your cart to see them here.</p>
    </div>
  );
};

export default Cart;
