// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Button from "./components/common/Button"

function App() {
  

  return (
    <>
    <Button variant="primary">Primario</Button>
    <Button variant="secondary">Secundario</Button>
    <Button variant="auxiliar">Auxiliar</Button>
    
        <button className="btn">Button base</button>
        <button className="btn btn-primary">Button primary</button>
        <button className="btn btn-secondary">Button secondary</button>
        <button className="btn btn-auxiliar">Button auxiliar</button>
    </>
  )
}

export default App
