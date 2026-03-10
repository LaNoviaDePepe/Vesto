import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts - Los dejamos estáticos porque se usan casi siempre
import NavbarPageFooterLayout from "./layouts/NavbarPageFooterLayout";
import NavbarPageLayout from "./layouts/NavbarPageLayout";
import LandingLayout from "./layouts/LandingLayout";
import GlobalLayout from "./layouts/GlobalLayout";
import PublicRoute from "./router/PublicRoute";
import ProtectedRoute from "./router/ProtectedRoute";
import AdminProtectedRoute from "./router/AdminProtectedRoute";

// Pages - CARGA DINÁMICA (Lazy Loading)
// Esto dividirá el archivo de 1MB en trozos más pequeños.
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ClosetPage = lazy(() => import("./pages/ClosetPage"));
const ClothingPage = lazy(() => import("./pages/ClothingPage"));
const OutfitsPage = lazy(() => import("./pages/OutfitsPage"));
const OutfitCreatorPage = lazy(() => import("./pages/OutfitCreatorPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

// Especialmente importante: las páginas de Admin que usan Recharts
const StatsPage = lazy(() => import("./pages/StatsPage").then(module => ({ default: module.StatsPage })));
const UserPage = lazy(() => import("./pages/UserPage").then(module => ({ default: module.UserPage })));

// Componente de carga simple para el Suspense
const PageLoader = () => (
  <div className="w-full h-screen flex items-center justify-center bg-auxiliary-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    children: [
      {
        element: <LandingLayout />,
        children: [{ 
          path: "/", 
          element: (
            <Suspense fallback={<PageLoader />}>
              <LandingPage />
            </Suspense>
          ) 
        }],
      },
      {
        element: <PublicRoute />,
        children: [
          {
            element: <NavbarPageFooterLayout />,
            children: [
              { path: "/login", element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
              { path: "/signUp", element: <Suspense fallback={<PageLoader />}><SignUpPage /></Suspense> },
              { path: "/reset-password", element: <Suspense fallback={<PageLoader />}><ResetPasswordPage /></Suspense> },
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
              { path: "/closet", element: <Suspense fallback={<PageLoader />}><ClosetPage /></Suspense> },
              { path: "/clothing", element: <Suspense fallback={<PageLoader />}><ClothingPage /></Suspense> },
              { path: "/outfits", element: <Suspense fallback={<PageLoader />}><OutfitsPage /></Suspense> },
              { path: "/outfitCreator", element: <Suspense fallback={<PageLoader />}><OutfitCreatorPage /></Suspense> },
              { path: "/profile", element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense> },
            ],
          },
        ],
      },
      {
        element: <AdminProtectedRoute />,
        children: [
          {
            element: <NavbarPageLayout />,
            children: [
              { path: "/admin/dashboard", element: <Suspense fallback={<PageLoader />}><StatsPage /></Suspense> },
              { path: "/admin/users", element: <Suspense fallback={<PageLoader />}><UserPage /></Suspense> },
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
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: 'font-body border-2 border-auxiliary-700 rounded-2xl',
          duration: 4000,
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}