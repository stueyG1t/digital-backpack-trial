import { Link } from "react-router-dom";
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to the University Digital Framework Self-assessment Tool
      </h1>
      <p className="text-lg text-white mb-8">
        Test your knowledge and see how well you perform!
      </p>
      <div className="flex justify-center gap-4 mt-10 flex-wrap">
        <Link to="/aletool">
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md transition duration-300">
            Start ALE's Tool
          </button>
        </Link>
        <Link to="/dsttool">
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md transition duration-300">
            Start DST's Tool
          </button>
        </Link>
      </div>
    </div>
  );
}
