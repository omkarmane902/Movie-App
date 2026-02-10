import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import Popular from "../pages/Popular";
import TopRated from "../pages/TopRated";
import Upcoming from "../pages/Upcoming";
import Watchlist from "../pages/Watchlist";
import SearchMobile from "../pages/SearchMobile";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/popular" element={<Popular />} />
      <Route path="/top-rated" element={<TopRated />} />
      <Route path="/upcoming" element={<Upcoming />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/search/:query" element={<SearchMobile />} />
    </Routes>
  );
};

export default Routing;