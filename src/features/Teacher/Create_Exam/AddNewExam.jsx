import React from "react";
import "./AddNewExam.css";
const AddNewExam = ({ questions }) => {
  return (
    <div className="exam-container">
      {questions.map((question, index) => (
        <div key={index} className="question">
          <h3>{`Question ${index + 1}: ${question.question}`}</h3>
          <ul className="choices">
            {question.choices.map((choice, choiceIndex) => (
              <li
                key={choiceIndex}
                className={
                  choiceIndex === question.correctChoice ? "correct-choice" : ""
                }
              >
                {choice}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AddNewExam;
