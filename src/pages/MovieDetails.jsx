import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_KEY = "e966d70231acda5e77b9470d55360f48";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [related, setRelated] = useState([]);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // ✅ New state to handle the in-app player visibility
  const [showPlayer, setShowPlayer] = useState(false);
  
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("watchlist")) || []
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const movieRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
        );
        setMovie(movieRes.data);
        setCast(movieRes.data.credits?.cast.slice(0, 10) || []);
        setRelated([]);
        setPage(1);
        setHasMore(true);
        setShowPlayer(false); // Reset player on movie change
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
    window.scrollTo({ top: 0, behavior: 'instant' }); 
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!hasMore || (page === 1 && related.length > 0)) return;
      setLoadingMore(true);
      try {
        const relatedRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&page=${page}`
        );
        const newResults = relatedRes.data.results.filter(m => m.poster_path);
        if (newResults.length === 0) {
          setHasMore(false);
        } else {
          setRelated(prev => [...prev, ...newResults]);
        }
      } catch (err) {
        console.error("Related fetch error:", err);
      } finally {
        setLoadingMore(false);
      }
    };
    fetchRelated();
  }, [id, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore || !hasMore) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadingMore, hasMore]);

  const toggleWatchlist = (e) => {
    e.preventDefault();
    const exists = watchlist.find((m) => m.id === movie.id);
    const updated = exists
      ? watchlist.filter((m) => m.id !== movie.id)
      : [...watchlist, movie];
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  if (loading) return (
    <div className="bg-[#141414] min-h-screen flex items-center justify-center text-red-600">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  const trailer = movie?.videos?.results.find(vid => vid.type === "Trailer" && vid.site === "YouTube");

  return (
    <div className="bg-[#141414] text-white pb-20 font-sans selection:bg-red-600">
      
      {/* 🎬 HERO BANNER / VIDEO PLAYER */}
      <div className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden bg-black">
        
        {/* ✅ IN-APP VIDEO PLAYER LOGIC */}
        {showPlayer && trailer ? (
          <div className="absolute inset-0 z-40">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            {/* Close button to go back to Movie Info */}
            <button 
              onClick={() => setShowPlayer(false)}
              className="absolute top-20 right-5 z-50 bg-black/60 text-white px-4 py-2 rounded-full hover:bg-red-600 transition font-bold"
            >
              ✕ Close Trailer
            </button>
          </div>
        ) : (
          <>
            <img 
              src={movie?.backdrop_path ? `${BACKDROP_URL}${movie.backdrop_path}` : `${IMAGE_URL}${movie?.poster_path}`} 
              className="w-full h-full object-cover brightness-[0.3]"
              alt={movie?.title}
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#141414] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-transparent to-transparent" />

            <div className="absolute bottom-[15%] left-[5%] right-[5%] z-10">
              <h1 className="text-4xl md:text-7xl font-black mb-4 uppercase tracking-tighter drop-shadow-2xl">
                {movie?.title}
              </h1>
              <div className="flex items-center gap-4 mb-6 text-sm md:text-lg font-semibold text-gray-300">
                <span className="text-green-500 font-bold">{Math.floor(movie?.vote_average * 10)}% Match</span>
                <span className="border border-gray-500 px-2 rounded text-xs">HD</span>
                <span>{movie?.release_date?.split("-")[0]}</span>
                <span>{movie?.runtime}m</span>
              </div>
              <p className="text-gray-300 text-sm md:text-lg line-clamp-3 mb-8 max-w-2xl drop-shadow-md">
                {movie?.overview}
              </p>
              <div className="flex items-center gap-4">
                {/* ✅ Play button toggles the local player state */}
                {trailer && (
                  <button 
                    onClick={() => setShowPlayer(true)}
                    className="bg-white text-black px-6 md:px-10 py-3 rounded font-bold flex items-center gap-3 hover:bg-opacity-80 transition active:scale-95"
                  >
                    <span className="text-2xl">▶</span> Play Trailer
                  </button>
                )}
                <button onClick={toggleWatchlist}
                        className={`px-6 md:px-10 py-3 rounded font-bold flex items-center gap-3 transition active:scale-95 ${
                          watchlist.find(m => m.id === movie?.id) ? "bg-red-600 text-white" : "bg-gray-500/50 text-white hover:bg-gray-500/30"
                        }`}>
                  <span className="text-2xl">{watchlist.find(m => m.id === movie?.id) ? "✓" : "+"}</span> 
                  {watchlist.find(m => m.id === movie?.id) ? "My List" : "Add to List"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🎭 CAST SECTION */}
      <div className="px-[5%] -mt-16 relative z-30">
        <h2 className="text-xl font-bold text-gray-400 mb-6 uppercase tracking-widest">Top Cast</h2>
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
          {cast.map(person => (
            <div key={person.id} className="min-w-27.5 text-center group">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-red-600 transition duration-300">
                <img src={person.profile_path ? `${IMAGE_URL}${person.profile_path}` : 'https://via.placeholder.com/200x200?text=Cast'} 
                     className="w-full h-full object-cover" alt={person.name} />
              </div>
              <p className="text-xs font-bold mt-2 truncate">{person.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🎞 RELATED CONTENT GRID */}
      <div className="px-[5%] mt-12 relative z-10">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
          More Like This
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-12">
          {related.map((m, index) => (
            <div key={`${m.id}-${index}`} 
                 onClick={() => navigate(`/movie/${m.id}`)}
                 className="relative group cursor-pointer transition-all duration-300 hover:scale-110 hover:z-50 shadow-2xl">
              <div className="aspect-2/3 rounded-sm overflow-hidden bg-zinc-900 border border-transparent group-hover:border-zinc-700">
                <img src={`${IMAGE_URL}${m.poster_path}`} className="w-full h-full object-cover" alt={m.title} loading="lazy" />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 pointer-events-none text-center">
                 <p className="text-xs font-black truncate uppercase tracking-tighter">{m.title}</p>
                 <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-green-500 font-bold">{Math.floor(m.vote_average * 10)}% Match</span>
                    <span className="text-[8px] border border-gray-500 px-1 rounded text-gray-400">HD</span>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {loadingMore && (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;