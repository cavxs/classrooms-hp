import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

import styles from "./style.module.css";

const MC = ({ n, q, ans, correct }) => {
  console.log(ans);
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
              checked={ans === "a"}
              disabled
            />
            {q.a}
            <span
              style={
                correct === undefined
                  ? null
                  : correct
                  ? { backgroundColor: "rgb(112 171 91)" }
                  : { backgroundColor: "rgb(182 95 95)" }
              }
            ></span>
          </label>
        </li>
        <li>
          <label>
            <input
              type="radio"
              name={n}
              id={"ib_" + n}
              value="b"
              checked={ans === "b"}
              disabled
            />
            {q.b}
            <span
              style={
                correct === undefined
                  ? null
                  : correct
                  ? { backgroundColor: "rgb(112 171 91)" }
                  : { backgroundColor: "rgb(182 95 95)" }
              }
            ></span>
          </label>
        </li>
        <li>
          <label>
            <input
              type="radio"
              name={n}
              id={"ic_" + n}
              value="c"
              checked={ans === "c"}
              disabled
            />

            {q.c}
            <span
              style={
                correct === undefined
                  ? null
                  : correct
                  ? { backgroundColor: "rgb(112 171 91)" }
                  : { backgroundColor: "rgb(182 95 95)" }
              }
            ></span>
          </label>
        </li>
        <li>
          <label>
            <input
              type="radio"
              name={n}
              id={"id_" + n}
              value="d"
              checked={ans === "d"}
              disabled
            />
            {q.d}
            <span
              style={
                correct === undefined
                  ? null
                  : correct
                  ? { backgroundColor: "rgb(112 171 91)" }
                  : { backgroundColor: "rgb(182 95 95)" }
              }
            ></span>
          </label>
        </li>
      </ul>
    </div>
  );
};

const Answers = () => {
  const { apx } = useContext(AuthContext);
  const { id: eid } = useParams();
  const [data, setData] = useState({});
  useEffect(() => {
    apx.get(`exams/answers/${eid}/`).then((res) => {
      console.log(res?.data);
      setData(() => res?.data);
    });
  }, []);
  return (
    <div>
      <h1 style={{ marginBottom: 0 }} className="big-heading">
        {data?.exam_data?.name}
      </h1>
      <h2 className={styles["teacher"]}>
        {data?.exam_data?.teacher_name}'s exam
      </h2>
      <h1 className={styles["grade"]}>
        {data?.answers?.grading ? (
          <h1 style={{ marginTop: 20 }}>
            Grade:{" "}
            {data.answers.grading?.filter((x) => x === true)?.length ?? 0}/
            {data?.answers?.data?.length}{" "}
            {(data?.answers?.grading?.filter((x) => x === true)?.length ??
              0) === data?.answers?.data.length
              ? "🏆"
              : null}
          </h1>
        ) : (
          "Ungraded"
        )}
      </h1>

      {/* <h1>Your Answers</h1> */}
      {data?.exam_data?.questions.map((q, i) => {
        return (
          <div key={i}>
            <h2 className={styles["qn"]}>
              Q{i + 1}. {q.text}
            </h2>
            {q.type == "field" ? (
              <p
                className={[
                  styles["qninp"],
                  styles[
                    data?.answers?.grading?.at(i) === undefined
                      ? ""
                      : data?.answers?.grading?.at(i)
                      ? "true"
                      : "false"
                  ],
                ].join(" ")}
              >
                {data.answers.data[i]}
              </p>
            ) : (
              <MC
                q={q}
                ans={data?.answers?.data[i]}
                correct={data?.answers?.grading?.at(i)}
                n={i}
              />
            )}
          </div>
        );
      }) ?? null}
    </div>
  );
};

export default Answers;
