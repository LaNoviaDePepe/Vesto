import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

// Layouts
import NavbarPageFooterLayout from "./layouts/NavbarPageFooterLayout";
import NavbarPageLayout from "./layouts/NavbarPageLayout";
import LandingLayout from "./layouts/LandingLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";
import ClosetPage from "./pages/ClosetPage";
import ClothingPage from "./pages/ClothingPage";
import OutfitsPage from "./pages/OutfitsPage";
import OutfitCreatorPage from "./pages/OutfitCreatorPage";
import ProfilePage from "./pages/ProfilePage";
import PublicRoute from "./router/PublicRoute";
import ProtectedRoute from "./router/ProtectedRoute";

const router = createBrowserRouter([
  {
    // Ruta compartida: LandingPage
    element: <LandingLayout />,
    children: [
      { path: "/", element: <LandingPage /> }
    ],
  },
  {
    // Rutas accesible para usuarios no logueados
    element: <PublicRoute />,
    children: [
      {
        element: <NavbarPageFooterLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/signUp", element: <SignUpPage /> },
        ]
      }
    ]
  },
  {
    // Rutas accesibles para usuarios logueados
    element: <ProtectedRoute />,
    children: [
      {
        element: <NavbarPageLayout />,
        children: [
          { path: "/closet", element: <ClosetPage /> },
          { path: "/clothing", element: <ClothingPage /> },
          { path: "/outfits", element: <OutfitsPage /> },
          { path: "/outfitCreator", element: <OutfitCreatorPage userId="4e9535ea-72b9-4dd2-8d96-e185da7c0d33" /> },
          { path: "/profile", element: <ProfilePage /> },
        ]
      },
    ]
  },

  // RUTA POR DEFECTO para redirigir a la raíz en caso de introducir una ruta incorrecta
  {
    path: "*",
    element: <Navigate to="/" replace />, 
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}