import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_KEY = "e966d70231acda5e77b9470d55360f48";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // 1. Track the current page
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  // 2. Fetch function that appends data
  const fetchMovies = async (pageNum) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${pageNum}`
      );
      const newMovies = res.data.results;

      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        // Append new results to previous movies
        setMovies((prev) => [...prev, ...newMovies]);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Initial load
  useEffect(() => {
    fetchMovies(1);
  }, []);

  // 4. Trigger fetch when page state increments
  useEffect(() => {
    if (page > 1) {
      fetchMovies(page);
    }
  }, [page]);

  // 5. Scroll Listener: Detect when user is near the bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 800 && 
        !loading && 
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="bg-[#141414] min-h-screen pb-20 pt-24 px-4 md:px-12 text-white overflow-x-hidden">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
        Popular on Movix
      </h1>

      {/* 🎞️ CINEMATIC GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-12 isolate">
        {movies.map((m, index) => (
          <div
            key={`${m.id}-${index}`} // Combined key to avoid issues with duplicate IDs across pages
            onClick={() => navigate(`/movie/${m.id}`)}
            className="relative z-0 group cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:z-40 will-change-transform"
          >
            <div className="aspect-2/3 rounded-sm overflow-hidden bg-[#222] shadow-2xl border border-transparent group-hover:border-zinc-700 transition-all">
              <img
                src={m.poster_path ? `${IMAGE_URL}${m.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
                alt={m.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 rounded-sm pointer-events-none">
              <p className="text-[10px] font-black truncate mb-1 uppercase tracking-tighter drop-shadow-md">{m.title}</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-green-500 font-bold drop-shadow-md">
                  {Math.floor(m.vote_average * 10)}% Match
                </span>
                <span className="text-[8px] border border-gray-500 px-1 rounded text-gray-300 font-bold bg-black/20">
                  HD
                </span>
              </div>
            </div>

            <div className="mt-2 group-hover:opacity-0 transition-opacity duration-300">
              <p className="text-[12px] font-medium truncate text-gray-200">{m.title}</p>
              <p className="text-[10px] text-gray-500 font-bold">⭐ {m.vote_average.toFixed(1)}</p>
            </div>
          </div>
        ))}

        {/* ⏳ SKELETON LOADER (Shown at bottom while loading more) */}
        {loading && (
          <>
            {[...Array(6)].map((_, i) => (
              <div key={`loading-${i}`} className="bg-[#222] animate-pulse aspect-2/3 rounded-sm" />
            ))}
          </>
        )}
      </div>

      {!hasMore && (
        <p className="text-center py-10 text-gray-500">You've reached the end of the list.</p>
      )}
    </div>
  );
};

export default Popular;