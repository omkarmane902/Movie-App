import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_KEY = "e966d70231acda5e77b9470d55360f48";
const BASE_URL = "https://api.themoviedb.org/3";
const HERO_IMG = "https://image.tmdb.org/t/p/original";
const THUMB_IMG = "https://image.tmdb.org/t/p/w500";

const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [watchlist, setWatchlist] = useState(JSON.parse(localStorage.getItem("watchlist")) || []);

  const fetchMovies = async (pageNum) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${pageNum}`);
      const data = res.data.results;
      setMovies((prev) => [...prev, ...data]);

      if (pageNum === 1 && data.length > 0) {
        setHeroMovie(data[Math.floor(Math.random() * data.length)]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(1); }, []);

  useEffect(() => {
    if (page > 1) fetchMovies(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const toggleWatchlist = (movie) => {
    const exists = watchlist.find((m) => m.id === movie.id);
    const updated = exists ? watchlist.filter((m) => m.id !== movie.id) : [...watchlist, movie];
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  return (
    <div className="bg-[#141414] text-white min-h-screen">
      {/* 🎬 HERO SECTION */}
      {heroMovie && (
        <header className="relative h-[70vh] md:h-[85vh] w-full">
          <div className="absolute inset-0">
            <img 
              src={`${HERO_IMG}${heroMovie.backdrop_path}`} 
              className="w-full h-full object-cover brightness-[0.5]"
              alt={heroMovie.title}
            />
            <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-12 max-w-3xl space-y-4 md:space-y-6 pt-10">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-2xl leading-tight">
              {heroMovie.title}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl font-medium drop-shadow-md line-clamp-2 sm:line-clamp-3 max-w-xl text-gray-200">
              {heroMovie.overview}
            </p>
            
            {/* ✅ MOBILE RESPONSIVE BUTTONS (Resolves image_2cf61c.png & image_2cfdbd.png) */}
            <div className="flex items-center gap-2 md:gap-4 pt-2">
              <button 
                onClick={() => navigate(`/movie/${heroMovie.id}`)} 
                className="bg-white text-black px-4 py-2 md:px-10 md:py-3 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-white/80 transition-all text-xs sm:text-base min-w-25 md:min-w-35"
              >
                <span className="text-lg md:text-2xl">▶</span> Play
              </button>
              <button 
                onClick={() => toggleWatchlist(heroMovie)} 
                className="bg-gray-500/60 text-white px-4 py-2 md:px-10 md:py-3 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-gray-500/40 transition-all text-xs sm:text-base min-w-30 md:min-w-40 backdrop-blur-sm"
              >
                <span className="text-lg md:text-2xl">{watchlist.find(m => m.id === heroMovie.id) ? "✓" : "+"}</span> My List
              </button>
            </div>
          </div>
        </header>
      )}

      {/* 🎞 MOVIE ROWS */}
      <div className="px-4 md:px-12 -mt-20 md:-mt-32 relative z-20 pb-20">
        <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 tracking-tight flex items-center gap-2">
           <span className="w-1 h-6 md:w-1.5 md:h-8 bg-red-600 rounded-full"></span> Trending Now
        </h2>
        
        {/* Responsive Grid: 2 columns on mobile, 6 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-x-2 md:gap-y-10 isolate">
          {movies.map((m, index) => (
            <div 
              key={`${m.id}-${index}`} 
              onClick={() => navigate(`/movie/${m.id}`)}
              className="relative group aspect-video rounded-sm overflow-hidden bg-zinc-900 cursor-pointer shadow-lg transition-all duration-500 ease-out hover:scale-105 md:hover:scale-110 hover:z-40"
            >
              <img
                src={`${THUMB_IMG}${m.backdrop_path || m.poster_path}`}
                alt={m.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 md:p-3 pointer-events-none">
                <p className="text-[10px] md:text-xs font-black truncate uppercase tracking-tighter mb-1">{m.title}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] md:text-[10px] text-green-500 font-bold">{Math.floor(m.vote_average * 10)}% Match</span>
                  <div className="text-[12px] md:text-[14px]">{watchlist.find((w) => w.id === m.id) ? "❤️" : "🤍"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Home;