import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Flame, Heart, Search, Star, Calendar } from "lucide-react";

const MobileBottomNav = () => {
  const { pathname } = useLocation();

  // Navigation configuration matching your existing pages
  const navs = [
    { label: "Home", path: "/", icon: Home },
    { label: "Popular", path: "/popular", icon: Flame },
    { label: "Top Rated", path: "/top-rated", icon: Star },
    { label: "Upcoming", path: "/upcoming", icon: Calendar },
    { label: "My List", path: "/watchlist", icon: Heart },
    { label: "Search", path: "/search/movies", icon: Search },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 lg:hidden flex justify-around py-3 z-100 pb-5">
      {navs.map((nav) => {
        const isActive = pathname === nav.path;
        const Icon = nav.icon;
        
        return (
          <Link
            key={nav.path}
            to={nav.path}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              isActive ? "text-white font-bold scale-105" : "text-gray-500 font-medium"
            }`}
          >
            {/* Animated Icon Wrapper */}
            <div className={`transition-colors duration-300 ${isActive ? "text-red-600" : "text-gray-500"}`}>
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2} 
                // Fills specific icons when active for that premium feel
                fill={isActive && (nav.label === "My List" || nav.label === "Top Rated") ? "currentColor" : "none"} 
              />
            </div>
            
            {/* Label - Reduced size to fit all 6 items on mobile screens */}
            <span className="text-[8px] uppercase tracking-tighter text-center">
              {nav.label}
            </span>
            
            {/* Active Indicator Dot (Signature Netflix Detail) */}
            {isActive && (
              <div className="w-1 h-1 bg-red-600 rounded-full mt-0.5 animate-pulse" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;