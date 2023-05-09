import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";

const ExamDiv = ({ name, linkk, edit_del = null }) => {
  const navigate = useNavigate();
  const { apx } = useContext(AuthContext);
  const [deleted, setDeleted] = useState(false);
  return (
    <>
      {!deleted && (
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
          {edit_del ? (
            <div className={styles["edit-del"]}>
              <button
                onClick={() => {
                  apx.delete(edit_del["del"]).then((res) => {
                    if (res) {
                      setDeleted(true);
                    }
                  });
                }}
                style={{ backgroundColor: "red" }}
                className="button hover-effect"
              >
                X
              </button>
              <button
                onClick={() => navigate(edit_del["edit"])}
                className="button hover-effect"
              >
                E
              </button>
            </div>
          ) : null}
        </div>
      )}
    </>
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
  const navigate = useNavigate();
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
    // TODO: remove the margin lefts and write a class in the css instead
    <div>
      <h2 className="big-heading lefted">Current Exams</h2>
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
      <h2 className="big-heading lefted">Exams Templates</h2>
      <div className={styles["exams-list"]}>
        {exams.made?.length == 0 ? (
          <h2 style={{ marginLeft: 20 }}>
            You haven't made any exam templates.
          </h2>
        ) : (
          <>
            {exams.made.map((e, i) => (
              <ExamDiv
                key={i}
                name={e.name}
                edit_del={{ edit: `/make/${e.id}`, del: `exams/${e.id}/` }}
              />
            )) ?? null}
          </>
        )}
      </div>
      <div className={styles["buttons"]}>
        <button
          onClick={() => navigate("/make")}
          className="button hover-effect"
        >
          Create Template
        </button>
      </div>
      <h2 className="big-heading lefted">Exams Given</h2>
      <div className={styles["exams-list"]}>
        {exams.given.map((e, i) => (
          <ExamDiv key={i} name={e.name} linkk={`/exam/${e.id}/`} />
        )) ?? null}
        {exams.given?.length == 0 ? (
          <h2 style={{ marginLeft: 20 }}>You have not given any exams.</h2>
        ) : null}
      </div>
      <h2 className="big-heading lefted">Past Exams</h2>
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
    </div>
  );
};

export default Exams;
