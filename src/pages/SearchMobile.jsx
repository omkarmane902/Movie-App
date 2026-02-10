import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, XCircle } from "lucide-react"; 
import axios from "axios";

const API_KEY = "e966d70231acda5e77b9470d55360f48";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const SearchMobile = () => {
  const { query } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState(query || "");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // ✅ Infinite Scroll States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("watchlist")) || []
  );

  // 1. Initial Search Logic
  useEffect(() => {
    setInput(query || "");
    const startSearch = async () => {
      if (!query || query === "movies" || query.trim() === "") {
        setMovies([]);
        return;
      }

      setLoading(true);
      setPage(1); // Reset page on new query
      setHasMore(true);
      
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`
        );
        const results = res.data.results.filter(m => m.poster_path);
        setMovies(results);
        if (res.data.page >= res.data.total_pages) setHasMore(false);
      } catch (err) {
        console.error("Search Error:", err);
      } finally {
        setLoading(false);
      }
    };

    startSearch();
    window.scrollTo(0, 0);
  }, [query]);

  // 2. Load More Logic
  useEffect(() => {
    if (page === 1 || !hasMore) return;

    const loadMore = async () => {
      setFetchingMore(true);
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
        );
        const newResults = res.data.results.filter(m => m.poster_path);
        
        // Append unique results
        setMovies(prev => [...prev, ...newResults]);
        
        if (res.data.page >= res.data.total_pages) setHasMore(false);
      } catch (err) {
        console.error("Load More Error:", err);
      } finally {
        setFetchingMore(false);
      }
    };

    loadMore();
  }, [page, query]);

  // 3. Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (loading || fetchingMore || !hasMore) return;

      // Trigger when within 800px of bottom
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, fetchingMore, hasMore]);

  const toggleWatchlist = (e, movie) => {
    e.stopPropagation();
    const exists = watchlist.find((m) => m.id === movie.id);
    const updated = exists
      ? watchlist.filter((m) => m.id !== movie.id)
      : [...watchlist, movie];

    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate(`/search/${encodeURIComponent(input.trim())}`);
  };

  const clearInput = () => {
    setInput("");
    navigate("/search/movies");
  };

  return (
    <div className="bg-[#141414] min-h-screen text-white pb-32">
      {/* 🔍 NETFLIX SEARCH BAR */}
      <div className="sticky top-0 z-100 bg-[#141414]/95 backdrop-blur-md px-4 pt-4 pb-4 border-b border-white/10">
        <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for movies..."
            className="w-full pl-12 pr-12 py-3 rounded-md bg-[#2b2b2b] text-sm text-white outline-none focus:bg-[#333] border border-transparent focus:border-gray-500 transition-all"
          />
          {input && (
            <XCircle 
              size={18} 
              onClick={clearInput}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer transition-colors" 
            />
          )}
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-2 mt-6">
        {loading ? (
          <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-[#222] animate-pulse aspect-2/3 rounded-sm" />
            ))}
          </div>
        ) : (
          <>
            {movies.length > 0 && (
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">
                Results for: <span className="text-white">"{query}"</span>
              </h2>
            )}
            
            <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6 isolate">
              {movies.map((m, index) => (
                <div
                  key={`${m.id}-${index}`} // Use index + id for infinite scroll uniqueness
                  onClick={() => navigate(`/movie/${m.id}`)}
                  className="relative group aspect-2/3 rounded-sm overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:z-40 will-change-transform shadow-2xl"
                >
                  <img src={`${IMAGE_URL}${m.poster_path}`} className="w-full h-full object-cover" alt={m.title} loading="lazy" />
                  
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 pointer-events-none">
                    <p className="text-[10px] font-black truncate uppercase tracking-tighter mb-1 drop-shadow-md">{m.title}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-green-500 font-bold">{Math.floor(m.vote_average * 10)}% Match</span>
                      <button 
                        onClick={(e) => toggleWatchlist(e, m)}
                        className="text-sm p-1 hover:scale-125 transition-transform pointer-events-auto"
                      >
                        {watchlist.find((w) => w.id === m.id) ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ⏳ BOTTOM LOADER */}
        {fetchingMore && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMobile;