import { BrowserRouter as Router } from "react-router-dom";
import FormTestingPages from "./pages/FormTestingPages";

function App() {
  return (
    <Router> 
      {/* Ahora Header y Navbar pueden usar Links porque están dentro del Router */}
      <FormTestingPages />
      
      
    </Router>
  );
}

export default App
