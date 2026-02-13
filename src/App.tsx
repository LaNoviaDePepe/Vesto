import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import NavbarPageFooterLayout from "./layouts/NavbarPageFooterLayout";
import NavbarPageLayout from "./layouts/NavbarPageLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";
import ClosetPage from "./pages/ClosetPage";
import ClothingPage from "./pages/ClothingPage";
import OutfitsPage from "./pages/OutfitsPage";
import OutfitCreatorPage from "./pages/OutfitCreatorPage";
import ProfilePage from "./pages/ProfilePage";
// import LandingPage from "./pages/LandingPage"; 
// import PrendasPage from "./pages/PrendasPage"; 
// import AddPrendaPage from "./pages/AddPrendaPage"; 
// import ConjuntoPage from "./pages/ConjuntoPage"; 
// import AddConjuntoPage from "./pages/AddConjuntoPage"; 
// import PerfilPage from "./pages/PerfilPage"; 

export default function App() {

  const router = createBrowserRouter([
    {
      // Grupo 1: Layout con Navbar, Página y Footer
      element: <NavbarPageFooterLayout />,
      children: [
        // { 
        //    path: "/", 
        //   element: isUser ? <Navigate to="/closet" replace /> : <LandingPage /> 
        // },
        { path: "/", element: <LandingPage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/signup", element: <SignUpPage /> },
      ],
    },
    {
      // Grupo 2: Layout con Navbar y Página (sin Footer)
      element: <NavbarPageLayout />,
      children: [
        { path: "/closet", element: <ClosetPage /> },
        { path: "/clothing", element: <ClothingPage /> },
        { path: "/outfits", element: <OutfitsPage /> },
        { path: "/outfitCreator", element: <OutfitCreatorPage userId={"4e9535ea-72b9-4dd2-8d96-e185da7c0d33"} /> },
        { path: "/profile", element: <ProfilePage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}