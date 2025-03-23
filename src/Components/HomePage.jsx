import { Link } from "react-router-dom";
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to the Digital Framework Diagnostic App
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Test your knowledge and see how well you perform!
      </p>
      <div className="flex justify-center gap-4 mt-10 flex-wrap">
        <Link to="/quiz">
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md transition duration-300">
            Start Quiz
          </button>
        </Link>
        <Link to="/domianlikert">
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md transition duration-300">
            Start Likert Survey
          </button>
        </Link>
      </div>
    </div>
  );
}
