import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "../src/Components/HomePage";
import QuestionApp from "../src/Components/quizApp"; // Import your quiz page

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuestionApp />} />
    </Routes>
  );
}

export default App;
