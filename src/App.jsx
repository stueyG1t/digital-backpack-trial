import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "../src/Components/HomePage";
import QuestionApp from "../src/Components/quizApp";
import DomainPage from "./Components/DomainPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuestionApp />} />
      <Route path="/domianlikert" element={<DomainPage />} />
    </Routes>
  );
}

export default App;
