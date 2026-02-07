import { BrowserRouter as Router } from "react-router-dom";

import Header from "./components/common/Header"

function App() {
  return (
    <Router> 
      {/* Ahora Header y Navbar pueden usar Links porque están dentro del Router */}
      <Header />
      
      
    </Router>
  );
}

export default App
