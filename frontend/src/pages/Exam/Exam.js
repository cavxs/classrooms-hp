import React, { useRef, useState, useEffect } from "react";

import styles from "./Exam.module.css";

// The page where either you take the exam or see the exam depending on the app's context.
const Exam = ({ questions }) => {
  const [answerData, setAnswerData] = useState({});
  const loadExamData = () => {};
  useEffect(() => {}, []);

  return (
    <div>
      <header>
        <h2 className={styles["exam-name"]}>Biology Exam</h2>
        <h3 className={styles["classroom"]}>Amira's Classroom</h3>
      </header>
      {questions &&
        questions.map((q, i) => (
          <div key={i} className={styles["question"]}>
            <h3>
              Q{i + 1}. {q.q}
            </h3>
            <input type="text" placeholder="Type your answer" />
          </div>
        ))}
      <div>
        <div className={styles["button exam-end"]}>End exam</div>
      </div>
    </div>
  );
};

export default Exam;
