import { useRef, useState, useEffect, useContext } from "react";

import styles from "./style.module.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const MC = ({ n, q, qChange }) => {
  return (
    <div className={styles["mcs"]}>
      <ul>
        <li>
          <label>
            <input
              type="radio"
              name={n}
              id={"ia_" + n}
              value="a"
              onChange={(e) => {
                qChange(n, "a");
              }}
            />

            {q.a}
            <span></span>
          </label>
        </li>
        <li>
          <label>
            <input
              type="radio"
              name={n}
              id={"ib_" + n}
              value="b"
              onChange={(e) => {
                qChange(n, "b");
              }}
            />
            {q.b}
            <span></span>
          </label>
        </li>
        <li>
          <label>
            <input
              type="radio"
              name={n}
              id={"ic_" + n}
              value="c"
              onChange={(e) => {
                qChange(n, "c");
              }}
            />

            {q.c}
            <span></span>
          </label>
        </li>
        <li>
          <label>
            <input
              type="radio"
              name={n}
              id={"id_" + n}
              value="d"
              onChange={(e) => {
                qChange(n, "d");
              }}
            />
            {q.d}
            <span></span>
          </label>
        </li>
      </ul>
    </div>
  );
};

const Question = ({ q, n, AD, SAFQ }) => (
  <div className={styles["question"]}>
    <h2>
      Q{n + 1}. {q.text}
    </h2>
    {q.type == "field" ? (
      <input
        type="text"
        className={styles["qninp"]}
        placeholder="Type your answer"
        value={AD[n]}
        onChange={(e) => SAFQ(n, e.target.value)}
      />
    ) : (
      <MC q={q} n={n} qChange={SAFQ} />
    )}
  </div>
);

const QuestionsHandler = ({ AD, SAFQ, questions }) => {
  return (
    <div>
      {questions &&
        questions.map((q, i) => (
          <Question q={q} n={i} key={i} SAFQ={SAFQ} AD={AD} />
        ))}
    </div>
  );
};

// The page where either you take the exam or see the exam depending on the app's context.
const Exam = () => {
  const [answerData, setAnswerData] = useState([]);
  const [examData, setExamData] = useState({ started: false, questions: [] });
  const { apx } = useContext(AuthContext);
  const { id: eid } = useParams();
  useEffect(() => {
    console.log(eid);
    apx.get(`exams/get/${eid}/`).then((res) => {
      if (!res) return navigate("/not-found");
      console.log(res.data);
      setExamData((old) => ({ ...old, ...res.data }));
    });
  }, []);

  const navigate = useNavigate();

  const setAnswerForQuestion = (n, ans) => {
    setAnswerData((old) => {
      const f = structuredClone(old);
      f[n] = ans;
      return f;
    });
  };
  console.log(answerData);

  return (
    <div className={styles["main-container"]}>
      {!examData.started ? (
        <div className={styles["start-pg-container"]}>
          <h2 className={[styles["exam-name"], "big-heading"].join(" ")}>
            {examData?.name}
          </h2>
          <h2 className={styles["classroom"]}>
            {examData?.teacher_name}'s Classroom
          </h2>
          {!examData?.taken ? (
            <button
              className={[styles["btn"], "button hover-effect"].join(" ")}
              onClick={() => {
                apx.get(`exams/start/${eid}/`).then((res) => {
                  if (res.data) {
                    console.log(res.data);
                    setExamData((old) => ({
                      ...old,
                      started: true,
                      questions: res.data?.questions,
                    }));
                    setAnswerData((old) =>
                      Array(res.data.questions.length).join(".").split(".")
                    );
                  }
                });
              }}
            >
              Start
            </button>
          ) : (
            <>
              <h3 className={styles["msg"]}>Exam taken already</h3>
              <button
                style={{ width: 200 }}
                className={[styles["btn"], "button hover-effect"].join(" ")}
                onClick={() => {
                  navigate("answers");
                }}
              >
                See Answers
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <QuestionsHandler
            AD={answerData}
            SAFQ={setAnswerForQuestion}
            questions={examData?.questions}
          />

          <div>
            <button
              className={[styles["exam-end"], "button"].join(" ")}
              onClick={() => {
                // submit answers
                apx
                  .post(`exams/submit/${eid}/`, { data: answerData })
                  .then((res) => {
                    console.log(res);
                    navigate("/classrooms");
                  });
              }}
            >
              End exam
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Exam;
