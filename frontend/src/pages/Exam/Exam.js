import React, { useRef, useState } from "react";

import styles from "./Exam.module.css";

// The page where either you take the exam or see the exam depending on the app's context.
const Exam = () => {
  const questions = [
    { q: "How does the wilflife nice?" },
    { q: "Very nice wildlife right?" },
  ];
  const [answerData, setAnswerData] = useState({});

  return (
    <div>
      <header>
        <h2 className={styles["exam-name"]}>Biology Exam</h2>
        <h3 className={styles["classroom"]}>Amira's Classroom</h3>
      </header>
      {questions.map((q, i) => (
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
