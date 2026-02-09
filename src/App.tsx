import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/common/Navbar';
import { GUEST_LINKS, USER_LINKS } from './constants/navLinks'; // Asegúrate que la ruta sea correcta
import Home from "./pages/Home";
import TestingPage from "./pages/TestingPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Closet from "./pages/Closet";
import Clothing from "./pages/Clothing";
import Outfits from "./pages/Outfits";
import OutfitsCreator from "./pages/OutfitsCreator";
import Profile from "./pages/Profile";

function App() {
  // Aquí simulo que el usuario está logueado. 
  // Más adelante esto vendrá de la autenticación.
  const isUser = true; 

  return (
    <Router>

      <Navbar 
        links={isUser ? USER_LINKS : GUEST_LINKS} 
        isUser={isUser} 
      />

      <Routes>

        <Route path="/testing" element={<TestingPage />} />

        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route path="/closet" element={<Closet />} />
        <Route path="/clothing" element={<Clothing />} />
        <Route path="/outfits" element={<Outfits />} />
        <Route path="/outfitCreator" element={<OutfitsCreator />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

    </Router>
  );
}

export default App;