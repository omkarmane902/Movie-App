import { BrowserRouter } from "react-router-dom";
import Routing from "../src/components/Routing";
import Navbar from "./components/Navbar";
import MobileBottomNav from "./components/MobileBottomNav";

function App() {
  return (
    <BrowserRouter>
      <Navbar />          {/* ✅ OK */}
      <Routing />         {/* ✅ Routes live here */}
      <MobileBottomNav /> {/* ✅ OK */}
    </BrowserRouter>
  );
}

export default App;
