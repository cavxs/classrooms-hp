import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

import styles from "./style.module.css";

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
          </div>
        );
      }) ?? null}
    </div>
  );
};

export default Answers;
