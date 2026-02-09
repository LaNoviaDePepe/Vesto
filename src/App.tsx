import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import NavbarPageFooterLayout from "./layouts/NavbarPageFooterLayout";
import NavbarPageLayout from "./layouts/NavbarPageLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage"; // Asumida por contexto
import PrendasPage from "./pages/PrendasPage"; // Asumida por contexto
import AddPrendaPage from "./pages/AddPrendaPage"; // Asumida por contexto
import ConjuntoPage from "./pages/ConjuntoPage"; // Asumida por contexto
import AddConjuntoPage from "./pages/AddConjuntoPage"; // Asumida por contexto
import PerfilPage from "./pages/PerfilPage"; // Asumida por contexto

// Definición del router siguiendo la estructura de objetos
const router = createBrowserRouter([
  {
    // Grupo 1: Layout con Navbar, Página y Footer
    element: <NavbarPageFooterLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUpPage /> },
    ],
  },
  {
    // Grupo 2: Layout con Navbar y Página (sin Footer)
    element: <NavbarPageLayout />,
    children: [
      { path: "/closet", element: <PrendasPage /> },
      { path: "/clothing", element: <AddPrendaPage /> },
      { path: "/outfits", element: <ConjuntoPage /> },
      { path: "/outfitsCreator", element: <AddConjuntoPage /> },
      { path: "/profile", element: <PerfilPage /> },
    ],
  },
]);

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