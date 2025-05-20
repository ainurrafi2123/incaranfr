"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Search, Bell, ShoppingCart, User, ChevronDown, Calendar, Zap, Shield, Share2 } from "lucide-react";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [activeTab, setActiveTab] = useState("forSale");
  const [profile, setProfile] = useState<{
    username: string;
    displayName: string;
    avatar: string;
    rating: number;
    reviews: number;
    followers: number;
    following: number;
    sold: number;
    memberSince: boolean;
    fastResponder: boolean;
    reliable: boolean;
    items: { id: number; image: string; status: string; title: string }[];
  } | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const BASE_URL = "http://localhost:8000";

  // Ambil data profil dari backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users/${params.username}`);
        const data = response.data;
        console.log("Profile data:", data);

        // Validasi dan set data profil
        const avatar = data.profile_picture
          ? data.profile_picture.startsWith("http")
            ? data.profile_picture
            : `${BASE_URL}/storage/${data.profile_picture}`
          : "/default-avatar.png";

        setProfile({
          username: data.username || params.username,
          displayName: data.name || params.username,
          avatar,
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          followers: data.followers || 0,
          following: data.following || 0,
          sold: data.sold || 0,
          memberSince: !!data.created_at,
          fastResponder: data.fast_responder || false,
          reliable: data.reliable || false,
          items: data.items || [],
        });

        // Cek apakah ini profil user yang login
        const loggedInUsername = localStorage.getItem("name");
        setIsOwnProfile(loggedInUsername === data.username);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      }
    };

    fetchProfile();
  }, [params.username]);

  const filteredItems = profile?.items.filter((item) => {
    if (activeTab === "forSale" && item.status === "forSale") return true;
    if (activeTab === "sold" && item.status === "sold") return true;
    return false;
  }) || [];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`text-${i < rating ? "blue-500" : "gray-300"}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm">
          <Link href="/" className="text-blue-500 hover:underline">
            Mercari
          </Link>
          <span>&gt;</span>
          <Link href={`/u/${profile.username}`} className="text-blue-500 hover:underline">
            @{profile.username}
          </Link>
        </div>
        <button>
          <Share2 size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
              <Image
                src={profile.avatar}
                alt={profile.displayName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                unoptimized
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
              <div className="w-5 h-5 flex items-center justify-center">✓</div>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold">{profile.displayName}</h1>
            <p className="text-gray-600">@{profile.username}</p>

            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400">{renderStars(profile.rating)}</div>
              <Link href="#reviews" className="ml-2 text-blue-500 text-sm hover:underline">
                {profile.reviews} review
              </Link>
            </div>

            {isOwnProfile && (
              <Link
                href="/profile"
                className="mt-2 inline-block text-blue-500 text-sm hover:underline"
              >
                Edit Profile
              </Link>
            )}
          </div>

          <div className="flex space-x-8 text-center">
            <div>
              <div className="text-gray-600">{profile.followers}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div>
              <div className="text-gray-600">{profile.following}</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
            <div>
              <div className="text-gray-600">{profile.sold}</div>
              <div className="text-sm text-gray-500">Sold</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex justify-center space-x-12 mt-6">
          {profile.memberSince && (
            <div className="flex flex-col items-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <Calendar size={20} className="text-gray-600" />
              </div>
              <span className="text-xs mt-1 text-gray-600">Member</span>
              <span className="text-xs text-gray-600">Since</span>
            </div>
          )}
          {profile.fastResponder && (
            <div className="flex flex-col items-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <Zap size={20} className="text-gray-600" />
              </div>
              <span className="text-xs mt-1 text-gray-600">Fast</span>
              <span className="text-xs text-gray-600">Responder</span>
            </div>
          )}
          {profile.reliable && (
            <div className="flex flex-col items-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <Shield size={20} className="text-gray-600" />
              </div>
              <span className="text-xs mt-1 text-gray-600">Reliable</span>
              <span className="text-xs text-gray-600"> </span>
            </div>
          )}
        </div>
      </div>

      {/* Items section */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-lg font-medium">{profile.items.length} Items</h2>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-4">
          <button
            className={`py-2 px-4 ${activeTab === "forSale" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("forSale")}
          >
            For Sale
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "sold" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("sold")}
          >
            Sold
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative">
              <div className="bg-gray-200 aspect-square rounded-md overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  unoptimized
                  onError={(e) => (e.currentTarget.src = "/default-item.png")}
                />
              </div>
              {item.status === "sold" && (
                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded">
                  SOLD
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}