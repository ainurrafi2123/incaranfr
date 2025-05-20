import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaPinterest,
  FaSnapchatGhost,
} from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1F71] text-white py-10 px-6 md:px-20">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        {/* SHOP */}
        <div>
          <h3 className="font-bold mb-2">SHOP</h3>
          <ul className="space-y-1">
            <li>Trending</li>
            <li>Brands</li>
            <li>Categories</li>
            <li>Deals</li>
            <li>How it works</li>
            <li>Gift card exchange</li>
            <li>Create an account</li>
          </ul>
        </div>

        {/* SELL */}
        <div>
          <h3 className="font-bold mb-2">SELL</h3>
          <ul className="space-y-1">
            <li>How to sell</li>
            <li>Packaging</li>
            <li>Shipping</li>
            <li>Getting paid</li>
            <li>Authenticate</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="font-bold mb-2">SUPPORT</h3>
          <ul className="space-y-1">
            <li>Contact Us</li>
            <li>Help Center</li>
            <li>Service Status</li>
            <li>Marketplace Guidelines</li>
            <li>Safety Guidelines</li>
            <li>Buyer Protection</li>
            <li>Seller Protection</li>
            <li>Refunds and Returns</li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="font-bold mb-2">COMPANY & POLICIES</h3>
          <ul className="space-y-1">
            <li>About Us</li>
            <li>Blog</li>
            <li>Careers</li>
            <li>Policy Center</li>
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Payments */}
          <div>
            <h3 className="font-bold mb-2">WE ACCEPT</h3>
            <div className="flex flex-wrap gap-2">
              <img src="/icons/visa.png" alt="Visa" className="h-6" />
              <img src="/icons/paypal.png" alt="Paypal" className="h-6" />
              {/* Tambahkan lainnya jika tersedia */}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold mb-2">FIND US ON</h3>
            <div className="flex gap-3 text-lg">
              <FaFacebookF />
              <FaTwitter />
              <FaInstagram />
              <FaTiktok />
              <FaYoutube />
              <FaPinterest />
              <FaSnapchatGhost />
            </div>
          </div>

          {/* App Links */}
          <div>
            <h3 className="font-bold mb-2">GET THE APP</h3>
            <div className="flex gap-2">
              <img src="/icons/appstore.png" alt="App Store" className="h-10" />
              <img src="/icons/googleplay.png" alt="Google Play" className="h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Brand Name */}
      <div className="mt-10 text-center text-white font-semibold tracking-widest text-lg">
        INCARAN
      </div>
    </footer>
  );
};

export default Footer;
