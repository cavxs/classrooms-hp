import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./style.module.css";
import { AuthContext } from "../../context/AuthContext";
import Popup from "../../components/Popup/Popup";

const Classroom = () => {
  const [classroomData, setClassroomData] = useState();
  const [popups, setPopups] = useState({
    add: false,
    exam_select: false,
    delete_confirm: false,
  });
  const [exams, setExams] = useState([]);
  const { apx } = useContext(AuthContext);
  const { id: cid } = useParams();

  const navigate = useNavigate();

  const showPopup = (pname) => {
    // console.log("called1");
    return (v) => {
      //   console.log("called2");
      setPopups((old) => ({ ...old, [pname]: v }));
    };
  };

  useEffect(() => {
    console.log(cid);
    apx.get(`classrooms/${cid}/`).then((res) => {
      console.log(res.data);
      setClassroomData(res.data);
    });
  }, []);

  useEffect(() => {
    if (popups.exam_select) {
      // load all the exams to popuplate the popup
      apx.get("exams/", { params: { templates: true } }).then((res) => {
        console.log(res.data);
        if (res?.data) return setExams(res.data);
        console.error("an error occurred when fetching exams");
      });
    }
  }, [popups]);

  return (
    <div className={styles["wrapper"]}>
      <h1 className="big-heading">{classroomData?.name}</h1>
      <h3 className={styles["teacher"]}>
        {classroomData?.is_owner
          ? "Your Classroom"
          : classroomData?.teacher_firstname}
      </h3>
      <div className={styles["layout"]}>
        <div className={styles["left"]}>
          {classroomData?.exam ? (
            <>
              <div className={[styles["active-exam"]].join(" ")}>
                <div className={styles["exam-status"]}>
                  <h5>Active Exam</h5>
                  <h3>{classroomData?.exam_name}</h3>
                </div>
                <div className={styles["exam-buttons"]}>
                  {classroomData?.is_owner ? (
                    <button
                      onClick={() => {
                        navigate(`/exam/${classroomData?.exam}/check`);
                      }}
                    >
                      C
                    </button>
                  ) : classroomData?.taken ? (
                    <button
                      onClick={() =>
                        navigate(`/exam/${classroomData?.exam}/answers`)
                      }
                    >
                      {"🗸"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // navigate to the test of the classroom
                        navigate(`/exam/${classroomData?.exam}`);
                      }}
                    >
                      {">"}
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : null}

          <div className={styles["student-list"]}>
            {classroomData?.students?.length ? (
              <ul>
                {classroomData?.students.map((s, i) => (
                  <li className="hover-effect no-shadow" key={i}>
                    {s.first_name} {s.last_name}
                    {classroomData?.is_owner ? (
                      <div
                        className={[
                          styles["st-options"],
                          !s?.grade
                            ? null
                            : s.grade == "took"
                            ? styles["took"]
                            : styles["checked"],
                        ].join(" ")}
                      >
                        <div></div>
                        <h2>
                          {1}/{classroomData?.exam_questions}
                        </h2>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <h2>No students yet.</h2>
            )}
          </div>
        </div>
        <div className={styles["right"]}>
          {classroomData?.is_owner ? (
            <div className={styles["buttons"]}>
              <button
                className={["button", "hover-effect", styles["ownerbtn"]].join(
                  " "
                )}
                onClick={() => showPopup("add")(true)}
              >
                Add Students
              </button>
              <button
                className={["button", "hover-effect", styles["ownerbtn"]].join(
                  " "
                )}
                onClick={() => showPopup("exam_select")(true)}
              >
                Assign Exam
              </button>
              <button
                className={["button", "hover-effect", styles["ownerbtn"]].join(
                  " "
                )}
                style={{ backgroundColor: "#b65f5f" }}
                onClick={() => showPopup("delete_confirm")(true)}
              >
                Delete Classroom
              </button>
            </div>
          ) : classroomData?.your_grade ? (
            <div className={styles["last-grade"]}>
              <h5>Your Last Grade</h5>
              <h3
                style={{
                  color:
                    classroomData.your_grade?.filter((x) => x === true)
                      ?.length ?? 0 >= classroomData.exam_questions / 2
                      ? "#407A46"
                      : "#B65F5F",
                }}
              >
                {classroomData.your_grade?.filter((x) => x === true)?.length ??
                  0}
                /{classroomData.exam_questions}
              </h3>
            </div>
          ) : null}
        </div>
      </div>
      {/* <h2>Students ({classroomData?.students.length})</h2> */}
      {popups.add && (
        <Popup
          shown={showPopup("add")}
          title="Add Students"
          buttons={[{ text: "OK" }]}
        >
          <p style={{ textAlign: "center" }}>
            To add students, send the following code to them.
          </p>
          <h1 style={{ margin: "0" }}>{classroomData?.code}</h1>
        </Popup>
      )}
      {popups.exam_select && (
        <Popup
          shown={showPopup("exam_select")}
          title="Assign Exam"
          buttons={[
            { text: "Cancel" },
            {
              text: "Create",
              click: () => {
                navigate("/make");
              },
            },
          ]}
        >
          <ul className={styles["examlist"]}>
            {exams?.length &&
              exams.map((e, i) => (
                <li
                  key={i}
                  onClick={() => {
                    apx
                      .put(`classrooms/${cid}/assign/`, { exam: e.id })
                      .then((res) => {
                        console.log(res);
                        if (res?.data) {
                          setClassroomData(res.data);
                          showPopup("exam_select")(false);
                        }
                      });
                  }}
                >
                  {e.name}
                </li>
              ))}
          </ul>
        </Popup>
      )}
      {popups.delete_confirm && (
        <Popup
          shown={showPopup("delete_confirm")}
          title="Confirm Deletion"
          buttons={[
            { text: "Cancel" },
            {
              text: "Delete",
              click: () => {
                apx.delete(`classrooms/${cid}/`).then((res) => {
                  console.log(res.data);
                  if (res?.status === 204) navigate("/classrooms");
                });
              },
            },
          ]}
        >
          <p style={{ textAlign: "center", fontSize: 18 }}>
            Are you sure you want to delete this classroom?
          </p>
        </Popup>
      )}
    </div>
  );
};

export default Classroom;
