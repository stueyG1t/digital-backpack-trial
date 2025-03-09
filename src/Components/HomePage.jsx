import { Link } from "react-router-dom";
export default function HomePage() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to the Digital Framework Diagnostic App</h1>
      <p>Test your knowledge and see how well you perform!</p>
      {/* Use Link to navigate to the quiz page */}
      <Link to="/quiz">
        <button
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Start Quiz
        </button>
      </Link>
    </div>
  );
}
