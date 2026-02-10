import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_KEY = "e966d70231acda5e77b9470d55360f48";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const Search = () => {
  const { query } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
      )
      .then((res) => setMovies(res.data.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Searching movies...
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen px-6 py-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        🔍 Results for "{query}"
      </h1>

      {movies.length === 0 ? (
        <p className="text-gray-400">No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="cursor-pointer bg-[#141414] rounded-xl overflow-hidden hover:scale-105 transition"
            >
              <img
                src={`${IMAGE_URL}${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-72 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold truncate">
                  {movie.title}
                </h2>
                <p className="text-yellow-400 text-sm">
                  ⭐ {movie.vote_average}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
