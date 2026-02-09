import { BrowserRouter as Router } from "react-router-dom";
import TestingPage from "./pages/TestingPage";

function App() {
  return (
    <Router> 
      {/* Ahora Header y Navbar pueden usar Links porque están dentro del Router */}
      <TestingPage />
      
      
    </Router>
  );
}

export default App
