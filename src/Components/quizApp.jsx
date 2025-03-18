import React, { useState, useEffect } from "react";
import "./QuestionApp.css";
import questionsData from "./questions";
import typeAImg from "../images/typeA.png";
import typeBImg from "../images/typeB.png";
import typeCImg from "../images/typeC.png";
import timer from "../images/timer.png";
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
    if (quizCompleted) return;
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
    if (userType === "A") return ""; //advanced user
    // Filter only categories where a score was recorded
    const validScores = Object.entries(categoryScores).filter(
      ([_, score]) => score > 0
    );
    // If no scores were recorded, return a generic message
    if (validScores.length === 0) {
      return "No questions were answered. Please try again.";
    }
    // Find the lowest-scoring category
    const lowestCategory = validScores.reduce((lowest, current) =>
      current[1] < lowest[1] ? current : lowest
    )[0];
    return `You need to improve in ${lowestCategory}.`;
  };
  //recommended resources links
  const getRecommendedResources = () => {
    if (userType === "A") return [];
    // Filter only categories where a score was recorded
    const validScores = Object.entries(categoryScores).filter(
      ([_, score]) => score > 0
    );
    // If no scores were recorded, return a generic message
    if (validScores.length === 0) {
      return "No questions were answered. Please try again.";
    }
    // Find the lowest-scoring category
    const lowestCategory = validScores.reduce((lowest, current) =>
      current[1] < lowest[1] ? current : lowest
    )[0];
    return recommendedResources[lowestCategory] || [];
  };

  // Calculate progress percentage
  const progress = ((currentIndex / totalQuestions) * 100).toFixed(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(5); // 1-minute timer per question, adjust the time here
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    //RESET TIMER when question index changes
    setQuestionTimeLeft(5); //adjust the time here
  }, [currentIndex]);
  //Set the timer
  useEffect(() => {
    if (!quizCompleted && questionTimeLeft > 0) {
      const timer = setInterval(() => {
        setQuestionTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (questionTimeLeft === 0) {
      handleNextQuestion(); // Auto-move to the next question if time runs out
    }
  }, [questionTimeLeft, quizCompleted]);

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setQuestionTimeLeft(5); // Reset timer for next question, adjust the time here
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="quiz-container">
      {currentIndex < questions.length && !quizCompleted ? (
        <div className="quiz-section">
          {/* Timer for Each Question */}
          <img
            src={timer}
            alt="Timer"
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <div className="timer">
            Time Left: {Math.floor(questionTimeLeft / 60)}:
            {(questionTimeLeft % 60).toString().padStart(2, "0")}
          </div>
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
          {userType !== "A" && totalScore !== 0 && (
            <p style={{ color: "red", fontSize: "18px" }}>
              {getImprovementRecommendation()}
            </p>
          )}
          {userType !== "A" && totalScore !== 0 && (
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
          {/* <h3>Category Scores:</h3>
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
          </ul> */}
          {totalScore !== 0 && (
            <div>
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
              {/* Dynamically adjust radar chart domain */}
              {Object.keys(categoryScores).length > 0 && (
                <RadarChart
                  cx={250}
                  cy={200}
                  outerRadius={150}
                  width={500}
                  height={400}
                  data={Object.entries(categoryScores).map(([name, score]) => ({
                    name,
                    score,
                  }))}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[
                      0,
                      Math.max(...Object.values(categoryScores), 5) + 5,
                    ]}
                  />
                  <Tooltip />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              )}
            </div>
          )}

          <Link to="/">
            <button className="homebutton">Home Page</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuestionApp;
