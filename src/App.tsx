import { BrowserRouter, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavbarPageFooterLayout from "./layouts/NavbarPageFooterLayout";
import NavbarPageLayout from "./layouts/NavbarPageLayout";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (

    <BrowserRouter>
      <Routes>

        <Route element={<NavbarPageFooterLayout />}>

          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

        </Route>

        <Route element={<NavbarPageLayout />}>

          <Route path="/prendas" element={<PrendasPage />} />
          <Route path="/addPrenda" element={<AddPrendaPage />} />
          <Route path="/conjunto" element={<ConjuntoPage />} />
          <Route path="/addConjunto" element={<AddConjuntoPage />} />
          <Route path="/perfil" element={<PerfilPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App
