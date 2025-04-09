import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import typeA from "../images/typeA.png";
import typeB from "../images/typeB.png";
import typeC from "../images/typeC.png";
import pipwerks from "pipwerks-scorm-api-wrapper";

const DSTResult = ({ responses, questions }) => {
  const radarData = [];
  let totalScore = 0;
  let totalPossible = 0;

  questions.forEach((domain, domainIndex) => {
    let domainScore = 0;
    const domainMax = domain.questions.length * 5;

    domain.questions.forEach((_, qIndex) => {
      const key = `D${domainIndex}-Q${qIndex}`;
      const value = parseInt(responses[key]);
      if (!isNaN(value)) {
        domainScore += value;
        totalScore += value;
        totalPossible += 5;
      }
    });
    radarData.push({
      domain: domain.name.split(": ")[1] || domain.name,
      score: (domainScore / domainMax) * 100,
      explorer: 40,
      navigator: 60,
      pioneer: 80,
    });
  });

  const scorePercent = (totalScore / totalPossible) * 100;
  let userType = "Explorer";
  let imageUrl = typeC;

  if (scorePercent > 90) {
    userType = "Pioneer";
    imageUrl = typeA;
  } else if (scorePercent > 60) {
    userType = "Navigator";
    imageUrl = typeB;
  }

  useEffect(() => {
    console.log("Submitting SCORM score:", scorePercent.toFixed(1));
    pipwerks.SCORM.init();
    pipwerks.SCORM.set("cmi.core.score.raw", scorePercent.toFixed(1));
    pipwerks.SCORM.set("cmi.core.score.max", "100");
    pipwerks.SCORM.set("cmi.core.score.min", "0");
    pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
    pipwerks.SCORM.save();
    pipwerks.SCORM.quit();
  }, [scorePercent]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Digital Teaching Framework Evaluation
      </h2>
      <ResponsiveContainer width="100%" height={500}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tickCount={6} />
          <Radar
            name="Your Score"
            dataKey="score"
            stroke="	#3B82F6"
            fill="	#3B82F6"
            fillOpacity={0.4}
          />
          <Radar
            name="Explorer"
            dataKey="explorer"
            stroke="#F87171"
            fill="#F87171"
            fillOpacity={0.1}
            strokeDasharray="4 2"
          />
          <Radar
            name="Navigator"
            dataKey="navigator"
            stroke="#FBBF24"
            fill="#FBBF24"
            fillOpacity={0.1}
            strokeDasharray="4 2"
          />
          <Radar
            name="Pioneer"
            dataKey="pioneer"
            stroke="#34D399"
            fill="#34D399"
            fillOpacity={0.4}
            strokeDasharray="4 2"
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Your Overall Score</h3>
        <p className="text-lg">
          {totalScore} / {totalPossible} ({scorePercent.toFixed(1)}%)
        </p>
        <p className="mt-2 text-lg font-bold">
          You are <span className="text-blue-600">Digital {userType}</span>
        </p>
        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt={`Type ${userType}`}
              className="mx-auto w-40 h-40 object-contain"
            />
          </div>
        )}
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Domain Breakdown</h3>
        <ul className="space-y-2">
          {radarData.map((score, idx) => (
            <li key={idx} className="p-3 bg-gray-100 dark:bg-gray-900 rounded border">
              <span className="font-medium">{score.domain}:</span>
              {score.score.toFixed(1)}%
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center gap-4 mt-10 flex-wrap">
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md transition duration-300"
        >
          Retake Survey
        </button>
        <Link to="/">
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md transition duration-300">
            Home Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DSTResult;
