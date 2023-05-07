import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./style.module.css";

const AnswersView = ({ eid, answers_id, apx }) => {
  const [data, setData] = useState({});

  const [currentGrades, setCurrentGrades] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    console.log("sending");
    apx
      .get(`exams/check/${eid}/`, { params: { rid: answers_id } })
      .then((res) => {
        console.log(res?.data);
        if (res?.data) {
          setData(res.data);
          setCurrentGrades(res.data.grading);
        }
      });
  }, []);

  const check = (v) => {
    apx
      .put(`exams/grade/${eid}/`, {
        question: v.q,
        value: v.v,
        taker: data.taker.id,
      })
      .then((res) => {
        setCurrentGrades(res.data.grading);
        console.log(res.data.grading);
      });
  };
  console.log(currentGrades);
  return (
    <div>
      <h1 style={{ marginBottom: 0 }} className="big-heading">
        Answers
      </h1>
      <h2 style={{ margin: 0, textAlign: "center" }}>{data?.exam?.name}</h2>
      <h2 style={{ marginTop: 10 }} className={styles["ansof"]}>
        {data?.taker?.first_name} {data?.taker?.last_name}
      </h2>
      {data?.grading ? <h2>Graded</h2> : <h2>Ungraded</h2>}
      {data?.exam?.questions?.map((q, i) => (
        <div key={i}>
          <h3 style={{ fontSize: 24 }}>
            Q{i + 1}. {q.text}
          </h3>
          <p
            className={[
              styles["qninp"],
              styles[
                currentGrades === undefined
                  ? ""
                  : currentGrades[i]
                  ? "true"
                  : "false"
              ],
            ].join(" ")}
          >
            <div className={styles["false-slider"]}></div>
            {data?.data[i]}
          </p>
          <div className={styles["correcting"]}>
            <button
              className={["button", "hover-effect"].join(" ")}
              onClick={() => check({ q: i, v: true })}
            >
              T
            </button>
            <button
              className={["button", "hover-effect"].join(" ")}
              onClick={() => check({ q: i, v: false })}
            >
              F
            </button>
          </div>
        </div>
      )) ?? null}
      <h1 style={{ marginTop: 20 }}>
        Grade: {currentGrades?.filter((x) => x === true)?.length ?? 0}/
        {data?.data?.length}{" "}
        {(currentGrades?.filter((x) => x === true)?.length ?? 0) ===
        data?.data?.length
          ? "🏆"
          : null}
      </h1>
      <button
        style={{ display: "block", margin: "0 auto 100px" }}
        className="button hover-effect"
        onClick={() => navigate(-1)}
      >
        Done
      </button>
    </div>
  );
};

const Check = () => {
  const [students, setStudents] = useState([]);
  const { apx } = useContext(AuthContext);
  const { id: eid, qid } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    console.log(qid ? "qid ok" : "no qid");
    if (!qid) {
      apx.get(`exams/check/${eid}/`).then((res) => {
        console.log(res?.data);
        if (res?.data) {
          setStudents(res.data);
        }
      });
    }
  }, [qid]);

  console.log(qid);
  return (
    <div>
      {qid === undefined ? (
        <>
          <h1 className="big-heading">Student Answers</h1>
          <ul className={styles["list"]}>
            {students?.map((s, i) => (
              <li
                key={i}
                className="hover-effect"
                onClick={() => {
                  navigate(String(s.id));
                }}
              >
                {s.taker__first_name}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <AnswersView eid={eid} answers_id={qid} apx={apx} />
      )}
    </div>
  );
};

export default Check;
