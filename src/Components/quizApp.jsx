import React, { useState } from "react";
import "./QuestionApp.css";
import questionsData from "./questions";
import typeAImg from "../images/typeA.png";
import typeBImg from "../images/typeB.png";
import typeCImg from "../images/typeC.png";
import recommendedResources from "./recommendations";
import {
  Radar,
  BarChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const getShuffledQuestions = () =>
  shuffleArray(
    questionsData.map((q) => ({
      ...q,
      answers: shuffleArray([...q.answers]),
    }))
  );

const QuestionApp = () => {
  const [questions, setQuestions] = useState(getShuffledQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categoryScores, setCategoryScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [questionScores, setQuestionScores] = useState([]);
  const totalQuestions = questionsData.length; // Example total number of questions

  const handleAnswer = (answerIndex) => {
    const question = questions[currentIndex];
    const correctIndex = question.answers.indexOf(question.correct);
    const lessCorrectIndex = question.answers.indexOf(question.lessCorrect);
    const score =
      answerIndex === correctIndex
        ? 5
        : answerIndex === lessCorrectIndex
        ? 3
        : 1;

    setCategoryScores((prevScores) => ({
      ...prevScores,
      [question.category]: (prevScores[question.category] || 0) + score,
    }));

    setTotalScore((prevTotal) => prevTotal + score);
    setQuestionScores((prev) => [...prev, { question: question.text, score }]);
    setCurrentIndex(currentIndex + 1);
  };

  const determineUserType = (score) =>
    score >= 30 ? "A" : score > 20 ? "B" : "C";
  const userType = determineUserType(totalScore);
  const getImageForType = () => {
    switch (userType) {
      case "A":
        return typeAImg;
      case "B":
        return typeBImg;
      case "C":
        return typeCImg;
      default:
        return null;
    }
  };
  //improve recommendation
  const getImprovementRecommendation = () => {
    if (userType === "A") return "";
    const lowestCategory = Object.entries(categoryScores).reduce(
      (lowest, current) => (current[1] < lowest[1] ? current : lowest)
    )[0];
    return `You need to improve in ${lowestCategory}.`;
  };
  //recommended resources links
  const getRecommendedResources = () => {
    if (userType === "A") return [];
    const lowestCategory = Object.entries(categoryScores).reduce(
      (lowest, current) => (current[1] < lowest[1] ? current : lowest)
    )[0];
    return recommendedResources[lowestCategory] || [];
  };
  // Calculate progress percentage
  const progress = ((currentIndex / totalQuestions) * 100).toFixed(0);

  return (
    <div className="quiz-container">
      {/* Progress Bar During Quiz */}
      <div className="progressbar">
        <div
          className="progressbar-fill"
          style={{
            width: `${progress}%`,
          }}
          data-progress={`${progress}%`}
        ></div>
      </div>
      {currentIndex < questions.length ? (
        <div className="quiz-section">
          <h2 className="question-text">{questions[currentIndex].text}</h2>
          <div className="answer-buttons">
            {questions[currentIndex].answers.map((answer, index) => (
              <button
                className="answer-button"
                key={index}
                onClick={() => handleAnswer(index)}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="result-section">
          <h2>Results</h2>
          <h3>Total Score: {totalScore}</h3>
          <h3>User Type: {determineUserType(totalScore)}</h3>
          <div>
            <img src={getImageForType()} alt={`Type ${userType}`} />
          </div>
          {userType !== "A" && (
            <p style={{ color: "red", fontSize: "18px" }}>
              {getImprovementRecommendation()}
            </p>
          )}
          {userType !== "A" && (
            <div className="recommended-resources">
              <h3>Recommended Resources for Improvement</h3>
              <ul>
                {getRecommendedResources().map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <h3>Category Scores:</h3>
          <ul>
            {Object.entries(categoryScores).map(([category, score]) => (
              <li key={category}>
                {category}: {score}
              </li>
            ))}
          </ul>
          <h3>Question Scores:</h3>
          <ul>
            {questionScores.map((q, index) => (
              <li key={index}>
                {q.question}: {q.score}
              </li>
            ))}
          </ul>
          <BarChart
            width={500}
            height={300}
            data={Object.entries(categoryScores).map(([key, value]) => ({
              name: key,
              score: value,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#8884d8" />
          </BarChart>
          <RadarChart
            cx={250}
            cy={200}
            outerRadius={150}
            width={500}
            height={400}
            data={Object.entries(categoryScores).map(([key, value]) => ({
              name: key,
              score: value,
            }))}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Tooltip />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
          <Link to="/">
            <button className="homebutton">Home Page</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuestionApp;
