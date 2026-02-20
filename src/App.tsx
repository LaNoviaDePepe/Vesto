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
import ResetPasswordPage from "./pages/ResetPasswordPage"; // <--- Importa la nueva página
import PublicRoute from "./router/PublicRoute";
import ProtectedRoute from "./router/ProtectedRoute";
import GlobalLayout from "./layouts/GlobalLayout";
import { Toaster } from "react-hot-toast";


const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    children: [
      {
        element: <LandingLayout />,
        children: [{ path: "/", element: <LandingPage /> }],
      },
      {
        element: <PublicRoute />,
        children: [
          {
            element: <NavbarPageFooterLayout />,
            children: [
              { path: "/login", element: <LoginPage /> },
              { path: "/signUp", element: <SignUpPage /> },
              { path: "/reset-password", element: <ResetPasswordPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <NavbarPageLayout />,
            children: [
              { path: "/closet", element: <ClosetPage /> },
              { path: "/clothing", element: <ClothingPage /> },
              { path: "/outfits", element: <OutfitsPage /> },
              { path: "/outfitCreator", element: <OutfitCreatorPage /> },
              { path: "/profile", element: <ProfilePage /> },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      {/* El Toaster debe estar fuera del RouterProvider para que sea global */}
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          // Opcional: Estilos que combinan con Vesto
          className: 'font-body border-2 border-auxiliary-700 rounded-2xl',
          duration: 4000,
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}