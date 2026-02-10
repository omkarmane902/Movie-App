import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const Watchlist = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState(
    JSON.parse(localStorage.getItem("watchlist")) || []
  );

  const removeFromWatchlist = (e, movieId) => {
    e.stopPropagation(); 
    const updated = movies.filter((m) => m.id !== movieId);
    setMovies(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  if (movies.length === 0) {
    return (
      <div className="bg-[#141414] min-h-screen text-white flex flex-col items-center justify-center font-sans">
        <div className="text-6xl mb-4">📺</div>
        <h1 className="text-xl font-bold">You haven't added anything to your list yet.</h1>
        <button 
          onClick={() => navigate("/")}
          className="mt-6 bg-white text-black px-6 py-2 rounded font-bold hover:bg-white/80 transition"
        >
          Browse Movies
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] min-h-screen pb-20 pt-24 px-4 md:px-12 text-white font-sans overflow-x-hidden">
      {/* 🏷️ PAGE HEADER */}
      <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
        My List
      </h1>

      {/* 🎞️ CINEMATIC CATALOG GRID */}
      {/* 'isolate' prevents hover scaling from escaping this container's stack */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-12 isolate">
        {movies.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/movie/${m.id}`)}
            /* ANIMATION FIXES:
               - hover:z-[40] stays below Navbar (z-100)
               - duration-500 ease-out for smoother Netflix-style zoom
               - will-change-transform optimizes browser rendering
            */
            className="relative z-0 group cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:z-40 will-change-transform"
          >
            {/* Poster Image Container */}
            <div className="aspect-2/3 rounded-sm overflow-hidden bg-[#222] shadow-2xl border border-transparent group-hover:border-zinc-700 transition-all">
              <img
                src={m.poster_path ? `${IMAGE_URL}${m.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
                alt={m.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Netflix-Style Hover Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 rounded-sm pointer-events-none">
              <p className="text-[10px] font-black truncate mb-1 uppercase tracking-tighter drop-shadow-md">
                {m.title}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-green-500 font-bold">
                  {Math.floor((m.vote_average || 7) * 10)}% Match
                </span>
                <button 
                  onClick={(e) => removeFromWatchlist(e, m.id)}
                  /* 'pointer-events-auto' allows this button to be clickable inside the 'pointer-events-none' overlay */
                  className="bg-zinc-800/80 p-1.5 rounded-full hover:bg-zinc-700 transition pointer-events-auto"
                  title="Remove from List"
                >
                  <span className="text-xs font-bold text-red-500">✕</span>
                </button>
              </div>
            </div>

            {/* Metadata (Hides on hover to prevent blurred/shaking text) */}
            <div className="mt-3 group-hover:opacity-0 transition-opacity duration-300 px-1">
              <h2 className="text-[13px] font-semibold truncate text-gray-100">{m.title}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="text-[11px] text-yellow-500 font-bold">⭐ {m.vote_average?.toFixed(1) || "N/A"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;