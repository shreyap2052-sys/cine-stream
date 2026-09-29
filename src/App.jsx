import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import LiveRoom from "./pages/LiveRoom";

function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <Link to="/" className="logo">
          Cine-Stream
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/live-room">Live Room</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/live-room" element={<LiveRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;