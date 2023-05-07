import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";

const ExamDiv = ({ name, linkk }) => {
  const navigate = useNavigate();
  return (
    <div
      className={[styles["exam-div"], "hover-effect"].join(" ")}
      onClick={() => {
        if (linkk) navigate(linkk);
      }}
    >
      <h2>{name}</h2>
      <p>
        Created by <span>Teacher</span>
      </p>
    </div>
  );
};

const Exams = () => {
  const [exams, setExams] = useState({
    current: [],
    given: [],
    past: [],
    made: [],
  });
  const { apx } = useContext(AuthContext);

  useEffect(() => {
    apx.get("exams/").then((res) => {
      if (res?.data) {
        console.log(res.data);
        setExams((old) => ({
          current: res.data.exams_current,
          given: res.data.exams_given,
          past: res.data.exams_past,
          made: res.data.exams_made,
        }));
      }
    });
  }, []);
  return (
    <div>
      <h2 style={{ textAlign: "left" }} className="big-heading">
        Current Exams
      </h2>
      <div className={styles["exams-list"]}>
        {exams.current?.map((e, i) => (
          <ExamDiv key={i} name={e.name} linkk={`/exam/${e.id}/`} />
        )) ?? null}
        {exams.current?.length == 0 ? (
          <h2 style={{ marginLeft: 20 }}>
            There are no currently active exams for you to take.
          </h2>
        ) : null}
      </div>
      <h2 style={{ textAlign: "left" }} className="big-heading">
        Exams Given
      </h2>
      <div className={styles["exams-list"]}>
        {exams.given.map((e, i) => (
          <ExamDiv key={i} name={e.name} linkk={`/exam/${e.id}/`} />
        )) ?? null}
        {exams.given?.length == 0 ? (
          <h2 style={{ marginLeft: 20 }}>You have not given any exams.</h2>
        ) : null}
      </div>
      <h2 style={{ textAlign: "left" }} className="big-heading">
        Past Exams
      </h2>
      <div className={styles["exams-list"]}>
        {exams.past.map((e, i) => (
          <ExamDiv key={i} linkk={`/exam/${e.exam__id}/`} name={e.exam__name} />
        )) ?? null}
        {exams.past?.length == 0 ? (
          <h2 style={{ marginLeft: 20 }}>
            You have not taken any exams in the past.
          </h2>
        ) : null}
      </div>
      <h2 style={{ textAlign: "left" }} className="big-heading">
        Exams Templates
      </h2>
      <div className={styles["exams-list"]}>
        {exams.made.map((e, i) => <ExamDiv key={i} name={e.name} />) ?? null}
        {exams.made?.length == 0 ? (
          <h2 style={{ marginLeft: 20 }}>You have made any exam.</h2>
        ) : null}
      </div>
    </div>
  );
};

export default Exams;
