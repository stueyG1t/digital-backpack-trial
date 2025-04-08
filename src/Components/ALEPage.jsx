import React, { useState, useMemo } from "react";
import ALEQuestions from "./ALEQuestions";
import ALEResult from "./ALEResult";

const LikertOptions = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const ALEPage = () => {
  const [responses, setResponses] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const domain = ALEQuestions[currentIndex];

  const questions = useMemo(() => {
    const all = [];
    domain.dimensions.forEach((dimension, dimIndex) => {
      dimension.questions.forEach((question, qIndex) => {
        all.push({
          question,
          key: `D${currentIndex}-Dim${dimIndex}-Q${qIndex}`,
        });
      });
    });
    return shuffleArray(all);
  }, [currentIndex]);

  const handleChange = (questionKey, value) => {
    setResponses({ ...responses, [questionKey]: value });
    setShowError(false);
  };

  const handleNext = () => {
    let unanswered = 0;
    questions.forEach((q) => {
      if (!responses[q.key]) unanswered++;
    });

    if (unanswered > 0) {
      setShowError(true);
      return;
    }

    if (currentIndex < ALEQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <ALEResult responses={responses} questions={ALEQuestions} />;
  }

  const progress = ((currentIndex + 1) / ALEQuestions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-6 mb-4 relative overflow-hidden">
        <div
          className="bg-blue-600 h-6 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
        <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
          {progress}%
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-4">{domain.name}</h2>

      {showError && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          Please complete all questions on this page before continuing.
        </div>
      )}

      {questions.map(({ question, key }) => (
        <div
          key={key}
          className="mb-4 p-4 border rounded-lg bg-gray-50 shadow-md"
        >
          <p className="mb-2 font-medium">{question}</p>
          <div className="flex justify-between space-x-2">
            {LikertOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-200 border w-full text-center justify-center
                  ${
                    responses[key] == opt.value
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-white text-gray-700 dark:text-white border-gray-300 hover:bg-gray-100"
                  }`}
              >
                <input
                  type="radio"
                  name={key}
                  value={opt.value}
                  checked={responses[key] == opt.value}
                  onChange={() => handleChange(key, opt.value)}
                  className="hidden"
                />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      {showError && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          Please complete all questions on this page before continuing.
        </div>
      )}

      <button
        onClick={handleNext}
        className="bg-blue-600 text-black px-4 py-2 rounded mt-4 hover:bg-blue-700 w-full"
      >
        {currentIndex < ALEQuestions.length - 1 ? "Next" : "Submit"}
      </button>
    </div>
  );
};

export default ALEPage;
