import { useState, useEffect, useContext } from "react";
import styles from "./style.module.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MC = ({ n, q, qChange }) => {
  const [correct, setCorrect] = useState(0);
  return (
    <ol>
      <li>
        <input
          type="text"
          value={q.a}
          onChange={(e) => {
            qChange(n, "a", e.target.value);
          }}
        />
        ✔️
      </li>
      <li>
        <input
          type="text"
          value={q.b}
          onChange={(e) => {
            qChange(n, "b", e.target.value);
          }}
        />
      </li>
      <li>
        <input
          type="text"
          value={q.c}
          onChange={(e) => {
            qChange(n, "c", e.target.value);
          }}
        />
      </li>
      <li>
        <input
          type="text"
          value={q.d}
          onChange={(e) => {
            qChange(n, "d", e.target.value);
          }}
        />
      </li>
    </ol>
  );
};

const Question = ({ T, n, q, qChange }) => {
  useEffect(() => {
    console.log(q);
  }, []);

  return (
    <div className={styles["question"]}>
      {n + 1}.
      <input
        type="text"
        value={q.text}
        onChange={(e) => {
          qChange(n, "text", e.target.value);
        }}
      />
      {T === "mc" && <MC q={q} n={n} qChange={qChange} />}
    </div>
  );
};

const ExamMaker = () => {
  const [examData, setExamData] = useState({ name: "" });
  const [questions, setQuestions] = useState([]);

  const { apx } = useContext(AuthContext);
  const navigate = useNavigate();
  const questionChange = (n, key, value) => {
    console.log("changing question", n, key, "to", value);
    setQuestions((old) => {
      const f = structuredClone(old);
      f[n][key] = value;
      return f;
    });
  };

  return (
    <div>
      <h1>Examination Creation</h1>
      <input
        className={styles["examname"]}
        type="text"
        placeholder="Exam name"
        value={examData.name}
        onChange={(e) => {
          setExamData({ ...examData, name: e.target.value });
        }}
      />
      <div className="">
        {questions.map((q, i) => (
          <Question key={i} qChange={questionChange} n={i} T={q.type} q={q} />
        ))}
      </div>
      <button
        onClick={() =>
          setQuestions([...questions, { type: "field", text: "" }])
        }
      >
        Add field question
      </button>
      <button
        onClick={() =>
          setQuestions([
            ...questions,
            { type: "mc", text: "", a: "", b: "", c: "", d: "" },
          ])
        }
      >
        Add multiple choice question
      </button>
      <button
        onClick={() => {
          apx.post("exams/", { name: examData.name, questions }).then((res) => {
            console.log(res);
            if (res) navigate("/classrooms", { replace: true });
          });
        }}
      >
        Done
      </button>
    </div>
  );
};

//TODO: validation
export default ExamMaker;
