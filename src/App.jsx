import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import ALEPage from "./Components/ALEPage";
import DSTPage from "./Components/DSTPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/aletool" element={<ALEPage />} />
      <Route path="/dsttool" element={<DSTPage />} />
    </Routes>
  );
}

export default App;
