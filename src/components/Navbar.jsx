import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_KEY = "e966d70231acda5e77b9470d55360f48";
const IMAGE_URL = "https://image.tmdb.org/t/p/w92";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Used to highlight active links
  const boxRef = useRef(null);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Transition from transparent to black on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live Search Dropdown Logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
        setResults(res.data.results.slice(0, 5));
      } catch (e) { console.error(e); }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle Search Submission (Enter key)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query)}`);
      setResults([]);
      setQuery("");
    }
  };

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-black shadow-xl" : "bg-transparent bg-linear-to-b from-black/90 to-transparent"}`}>
      <div className="h-16 px-6 md:px-12 flex items-center justify-between">
        
        {/* LEFT SIDE: LOGO & PAGES */}
        <div className="flex items-center gap-10">
          <Link to="/" className="text-3xl font-black text-red-600 tracking-tighter">MOVIX</Link>
          
          <ul className="hidden lg:flex gap-6 text-sm font-medium">
            <li>
              <Link to="/" className={`transition hover:text-gray-300 ${isActive("/") ? "text-white font-bold" : "text-gray-200"}`}>Home</Link>
            </li>
            <li>
              <Link to="/popular" className={`transition hover:text-gray-300 ${isActive("/popular") ? "text-white font-bold" : "text-gray-200"}`}>Popular</Link>
            </li>
            <li>
              <Link to="/top-rated" className={`transition hover:text-gray-300 ${isActive("/top-rated") ? "text-white font-bold" : "text-gray-200"}`}>Top Rated</Link>
            </li>
            <li>
              <Link to="/upcoming" className={`transition hover:text-gray-300 ${isActive("/upcoming") ? "text-white font-bold" : "text-gray-200"}`}>Upcoming</Link>
            </li>
            <li>
              <Link to="/watchlist" className={`transition hover:text-gray-300 ${isActive("/watchlist") ? "text-white font-bold" : "text-gray-200"}`}>My List</Link>
            </li>
          </ul>
        </div>

        {/* RIGHT SIDE: SEARCH */}
        <div ref={boxRef} className="relative flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Titles, people, genres"
              className="bg-black/40 border border-white/20 px-4 py-1.5 rounded text-sm text-white focus:w-64 transition-all w-40 outline-none focus:border-white placeholder:text-gray-400"
            />
            
            {/* Live Search Results Dropdown */}
            {results.length > 0 && (
              <div className="absolute top-12 right-0 w-80 bg-black/95 border border-zinc-800 rounded shadow-2xl overflow-hidden backdrop-blur-md">
                {results.map((m) => (
                  <div 
                    key={m.id} 
                    onClick={() => { navigate(`/movie/${m.id}`); setQuery(""); setResults([]); }} 
                    className="flex gap-3 p-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-900 last:border-none"
                  >
                    <img 
                      src={m.poster_path ? `${IMAGE_URL}${m.poster_path}` : "https://via.placeholder.com/92x138?text=No+Img"} 
                      alt="" 
                      className="w-10 h-14 object-cover rounded" 
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-bold truncate text-white">{m.title}</p>
                      <p className="text-xs text-green-500 font-semibold">{m.vote_average.toFixed(1)} Rating</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;