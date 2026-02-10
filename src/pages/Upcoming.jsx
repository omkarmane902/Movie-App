import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_KEY = "e966d70231acda5e77b9470d55360f48";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const Upcoming = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // 1. Track the current page
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  // 2. Fetch function that appends data to the existing list
  const fetchMovies = async (pageNum) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${pageNum}`
      );
      const newMovies = res.data.results;

      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        // Use functional state update to append new results to previous movies
        setMovies((prev) => [...prev, ...newMovies]);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Initial load of the first page
  useEffect(() => {
    fetchMovies(1);
  }, []);

  // 4. Trigger fetch whenever the page state increments
  useEffect(() => {
    if (page > 1) {
      fetchMovies(page);
    }
  }, [page]);

  // 5. Scroll Listener: Detect when user is near the bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      // Trigger when the user is within 800px of the page bottom
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
    <div className="bg-[#141414] min-h-screen pb-20 pt-24 px-4 md:px-12 text-white font-sans overflow-x-hidden">
      {/* 🏷️ PAGE HEADER */}
      <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
        Coming Soon
      </h1>

      {/* 🎞️ CINEMATIC CATALOG GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-12 isolate">
        {movies.map((m, index) => (
          <div
            key={`${m.id}-${index}`} // Combined key to avoid issues with duplicate IDs across pages
            onClick={() => navigate(`/movie/${m.id}`)}
            className="relative z-0 group cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:z-40 will-change-transform"
          >
            {/* Poster Image Container */}
            <div className="aspect-2/3 rounded-sm overflow-hidden bg-[#222] shadow-2xl border border-transparent group-hover:border-zinc-700 transition-all">
              <img
                src={m.poster_path ? `${IMAGE_URL}${m.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
                alt={m.title}
                className="w-full h-full object-cover transition-opacity duration-300"
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
                  New Release
                </span>
                <div className="flex gap-1">
                  <span className="text-[8px] border border-gray-600 px-1 rounded text-gray-400 font-bold bg-black/20">HD</span>
                </div>
              </div>
            </div>

            {/* Static Metadata */}
            <div className="mt-3 group-hover:opacity-0 transition-opacity duration-300">
              <h2 className="text-[13px] font-semibold truncate text-gray-100">{m.title}</h2>
              <div className="flex items-center justify-between mt-0.5">
                 <span className="text-[11px] text-gray-400 font-medium">📅 {m.release_date}</span>
                 <span className="text-[11px] text-yellow-500 font-bold">⭐ {m.vote_average.toFixed(1)}</span>
              </div>
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

      {!hasMore && movies.length > 0 && (
        <p className="text-center py-10 text-gray-500 font-medium">No more upcoming movies to show.</p>
      )}
    </div>
  );
};

export default Upcoming;