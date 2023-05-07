import { useState, useEffect, useContext } from "react";
import styles from "./style.module.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MC = ({ n, q, qChange }) => {
  const [correct, setCorrect] = useState(0);
  return (
    <div className={styles["mcs"]}>
      <ul>
        <li>
          <input
            type="text"
            value={q.a}
            className={styles["qninp"]}
            onChange={(e) => {
              qChange(n, "a", e.target.value);
            }}
          />
        </li>
        <li>
          <input
            type="text"
            value={q.b}
            className={styles["qninp"]}
            onChange={(e) => {
              qChange(n, "b", e.target.value);
            }}
          />
        </li>
        <li>
          <input
            type="text"
            value={q.c}
            className={styles["qninp"]}
            onChange={(e) => {
              qChange(n, "c", e.target.value);
            }}
          />
        </li>
        <li>
          <input
            type="text"
            value={q.d}
            className={styles["qninp"]}
            onChange={(e) => {
              qChange(n, "d", e.target.value);
            }}
          />
        </li>
      </ul>
    </div>
  );
};

const Question = ({ T, n, q, qChange }) => {
  useEffect(() => {
    console.log(q);
  }, []);

  return (
    <div className={styles["question"]}>
      Q{n + 1}.
      <input
        type="text"
        value={q.text}
        className={styles["qninp"]}
        onChange={(e) => {
          qChange(n, "text", e.target.value);
        }}
      />
      {T === "mc" && <MC q={q} n={n} qChange={qChange} />}
      <button
        onClick={() => {
          qChange(n, 0, 0, true);
        }}
        className={["button", styles["x"]].join(" ")}
      >
        X
      </button>
    </div>
  );
};

const ExamMaker = () => {
  const [examData, setExamData] = useState({ name: "" });
  const [questions, setQuestions] = useState([]);

  const { apx } = useContext(AuthContext);
  const navigate = useNavigate();
  const questionChange = (n, key, value, del = false) => {
    setQuestions((old) => {
      let f = structuredClone(old);
      if (!del) {
        f[n][key] = value;
      } else {
        console.log(f[0]);
        console.log(f[1]);
        console.log("deletiong at ", n);
        f.splice(n, 1);
        console.log(f);
      }
      return f;
    });
  };

  return (
    <div>
      <h1 className="big-heading">Exam Template</h1>
      <input
        className={[styles["examname"], styles["qninp"]].join(" ")}
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
      <div className={styles["bbtns"]}>
        <button
          className="button"
          onClick={() =>
            setQuestions([...questions, { type: "field", text: "" }])
          }
        >
          Add Field Question
        </button>
        <button
          className="button"
          onClick={() =>
            setQuestions([
              ...questions,
              { type: "mc", text: "", a: "", b: "", c: "", d: "" },
            ])
          }
        >
          Add MC Question
        </button>
      </div>
      <button
        className="button"
        style={{ display: "block", margin: "50px auto 100px" }}
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
