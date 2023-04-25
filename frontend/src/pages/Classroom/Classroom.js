import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styles from "./style.module.css";
import { AuthContext } from "../../context/AuthContext";
import Popup from "../../components/Popup/Popup";

const Classroom = () => {
  const [classroomData, setClassroomData] = useState();
  const [popups, setPopups] = useState({ add: false });
  const { apx } = useContext(AuthContext);
  const { id: cid } = useParams();

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

  return (
    <div className={styles["wrapper"]}>
      <h2>{classroomData?.name}</h2>
      <h3>{classroomData?.teacher_firstname}'s classroom</h3>
      <h2>Students</h2>
      <div className={styles["main"]}>
        <div className={styles["student-list"]}>
          <ul>
            <li>studnet 1</li>
            <li>studnet 2</li>
            <li>studnet 3</li>
          </ul>
        </div>
        <div className={styles["buttons"]}>
          <button onClick={() => showPopup("add")(true)}>Add Students</button>
          <button>Assign Exam</button>
        </div>
      </div>
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
    </div>
  );
};

export default Classroom;
