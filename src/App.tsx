import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Layouts
import NavbarPageFooterLayout from "./layouts/NavbarPageFooterLayout";
import NavbarPageLayout from "./layouts/NavbarPageLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AddPrendaPage from "./pages/AddPrendaPage";
// import LandingPage from "./pages/LandingPage"; 
// import PrendasPage from "./pages/PrendasPage"; 
// import AddPrendaPage from "./pages/AddPrendaPage"; 
// import ConjuntoPage from "./pages/ConjuntoPage"; 
// import AddConjuntoPage from "./pages/AddConjuntoPage"; 
// import PerfilPage from "./pages/PerfilPage"; 

export default function App() {
  // Simulación de autenticación
  const isUser = true; 

  const router = createBrowserRouter([
    {
      // Grupo 1: Layout con Navbar, Página y Footer
      element: <NavbarPageFooterLayout />,
      children: [
        // { 
        //    path: "/", 
        //   element: isUser ? <Navigate to="/closet" replace /> : <LandingPage /> 
        // },
        { path: "/login", element: <LoginPage /> },
        { path: "/signup", element: <SignUpPage /> },
      ],
    },
    {
      // Grupo 2: Layout con Navbar y Página (sin Footer)
      element: <NavbarPageLayout />,
      children: [
        { path: "/", element: <AddPrendaPage /> },
        // { path: "/closet", element: <PrendasPage /> },
        // { path: "/clothing", element: <AddPrendaPage /> },
        // { path: "/outfits", element: <ConjuntoPage /> },
        // { path: "/outfitsCreator", element: <AddConjuntoPage /> },
        // { path: "/profile", element: <PerfilPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />; 
}