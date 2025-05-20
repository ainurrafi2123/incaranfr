"use client";
import { useState } from 'react';
import { Search, ChevronDown, Trash2, Eye, Edit, Tag, Clock } from 'lucide-react';

export default function ProductListingsPage() {
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  const products = [
    {
      id: 1,
      title: "NEW AG The Stilt Corduroy Jeans Size 24",
      price: 85,
      likes: 0,
      views: 37,
      updated: "01/01/2020",
      smartPricing: false,
      image: "/api/placeholder/80/100",
      status: "active"
    },
    {
      id: 2,
      title: "Good American High Waist Distressed Jean",
      price: 80,
      likes: 1,
      views: 203,
      updated: "01/01/2020",
      smartPricing: false,
      image: "/api/placeholder/80/100",
      status: "active"
    },
    {
      id: 3,
      title: "Free People Distressed Button Fly Jeans",
      price: 55,
      likes: 0,
      views: 17,
      updated: "08/02/2020",
      smartPricing: false,
      image: "/api/placeholder/80/100",
      status: "active"
    },
    {
      id: 4,
      title: "Levi's 501 Original Fit Jeans",
      price: 65,
      likes: 3,
      views: 89,
      updated: "09/15/2020",
      smartPricing: true,
      image: "/api/placeholder/80/100",
      status: "active"
    }
  ];

  const filteredProducts = products.filter(product => product.status === selectedTab);

  const handleSelectAll = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProducts.map(product => product.id));
    }
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const tabs = [
    { id: 'active', label: 'Active', count: products.filter(p => p.status === 'active').length },
    { id: 'inactive', label: 'Inactive', count: 2 },
    { id: 'drafts', label: 'Drafts', count: 3 },
    { id: 'ready', label: 'Ready to list', count: 0 },
    { id: 'action', label: 'Action required', count: 1 },
    { id: 'sold', label: 'Sold', count: 5 },
    { id: 'progress', label: 'In progress', count: 0 },
    { id: 'complete', label: 'Complete', count: 8 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-satoshi">
      {/* Main Content */}
      <main className="container mx-auto py-8 px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Listings</h2>
          <button className="bg-accent hover:bg-opacity-90 text-white px-5 py-2.5 rounded-md font-medium">
            Add new listing
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-5 py-3 rounded-t-lg font-medium transition-all flex items-center ${
                  selectedTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm border-t-2 border-accent'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    selectedTab === tab.id ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-accent rounded border-gray-300"
                  checked={selectedItems.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={handleSelectAll}
                />
                <span className="ml-2 text-gray-700">Select all</span>
              </label>
              
              <button 
                className={`px-4 py-1.5 rounded font-medium text-sm ${
                  selectedItems.length > 0 ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-400'
                }`}
                disabled={selectedItems.length === 0}
              >
                Deactivate
              </button>
              
              <button 
                className={`px-4 py-1.5 rounded font-medium text-sm flex items-center ${
                  selectedItems.length > 0 ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-400'
                }`}
                disabled={selectedItems.length === 0}
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search within listings"
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="popular">Most viewed</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left w-12"></th>
                <th className="px-4 py-3 text-left w-24"></th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Item title / Price</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">Likes</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">Views</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">Updated</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">Smart pricing</th>
                <th className="px-4 py-3 text-right w-48"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-accent rounded border-gray-300"
                      checked={selectedItems.includes(product.id)}
                      onChange={() => handleSelectItem(product.id)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="bg-gray-100 rounded overflow-hidden">
                      <img src={product.image} alt={product.title} className="object-cover h-20 w-16" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.title}</h3>
                      <p className="text-accent font-bold">${product.price}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                        {product.likes}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium flex items-center">
                        <Eye size={14} className="mr-1 text-gray-500" />
                        {product.views}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium flex items-center">
                        <Clock size={14} className="mr-1 text-gray-500" />
                        {product.updated}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.smartPricing 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.smartPricing ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="px-4 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors font-medium">
                        Offer
                      </button>
                      <button className="px-4 py-1.5 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition-colors font-medium">
                        Promote
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No items found in this category
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}