import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popup/Popup";

const ClassroomButton = ({ cinfo, nav }) => {
  console.log(cinfo);
  return (
    <div className={styles["classroom-wrapper"]}>
      <div
        onClick={nav}
        className={["hover-effect", styles["classroom"]].join(" ")}
      >
        <div>
          <h2>{cinfo.name}</h2>
          <p>
            Created by <span style={{ color: "#202c39" }}>{cinfo.teacher}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const ClassroomList = () => {
  const [popups, setPopups] = useState({ classroom: false, join: false });
  const [classrooms, setClassrooms] = useState({ owner: [], non_owner: [] });
  const { apx } = useContext(AuthContext);

  const [code, setCode] = useState("");

  const [classroomName, setClassroomName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    apx.get("classrooms/").then((r) => {
      if (r?.data) {
        console.log(r.data);
        const cs = r?.data;
        const ownerClassrooms = cs.filter((obj) => obj.is_owner === true);
        const joinedClassrooms = cs.filter((obj) => obj.is_owner !== true);
        setClassrooms({ owner: ownerClassrooms, non_owner: joinedClassrooms });
      }
    });
  }, []);

  return (
    <div>
      {popups.classroom && (
        // <ClassroomCreation
        //   closepopup={() => setPopups((old) => ({ ...old, classroom: false }))}
        // />
        <Popup
          shown={(v) => setPopups((old) => ({ ...old, classroom: v }))}
          title="Create a Classroom"
          buttons={[
            { text: "Cancel" },
            {
              text: "Create",
              click: () => {
                setPopups((old) => ({ ...old, classroom: false }));
                apx.post("classrooms/", { name: classroomName }).then((res) => {
                  console.log(res);
                  if (res?.status === 201) {
                    setClassrooms((old) => {
                      return {
                        owner: [...old.owner, res.data],
                        non_owner: old.non_owner,
                      };
                    });
                  } else {
                    // TODO: make an error message
                  }
                });
              },
            },
          ]}
        >
          <input
            style={{ marginTop: 20 }}
            type="text"
            value={classroomName}
            onChange={(e) => setClassroomName(e.target.value)}
          />
        </Popup>
      )}
      {popups.join && (
        <Popup
          shown={(v) => setPopups((old) => ({ ...old, join: v }))}
          title="Join Classroom"
          buttons={[
            { text: "Cancel" },
            {
              text: "Join",
              click: () => {
                // send a request to the server asking it to join a classroom
                apx.post("classrooms/join/", { code }).then((res) => {
                  console.log(res);
                  if (res?.status === 201) {
                    setPopups((old) => ({ ...old, join: false }));
                    setClassrooms((old) => {
                      return {
                        owner: old.owner,
                        non_owner: [...old.non_owner, res.data],
                      };
                    });
                  } else {
                    // TODO: make an error message
                  }
                });
              },
            },
          ]}
        >
          <input
            style={{ marginTop: 20 }}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Popup>
      )}
      {classrooms.non_owner?.length ? (
        <>
          <h1 className="big-heading">Joined Classrooms</h1>
          <div className={styles["classrooms"]}>
            {classrooms.non_owner.map((c, i) => (
              <ClassroomButton
                key={i}
                nav={() => navigate(`/classroom/${c.id}`)}
                cinfo={{ name: c.name, teacher: c.teacher_firstname }}
              >
                {c.name}
              </ClassroomButton>
            ))}
          </div>
        </>
      ) : null}

      {classrooms.owner?.length ? (
        <>
          <h1 className="big-heading">Created Classrooms</h1>
          <div className={styles["classrooms"]}>
            {classrooms.owner.map((c, i) => (
              <ClassroomButton
                key={i}
                nav={() => navigate(`/classroom/${c.id}`)}
                cinfo={{ name: c.name, teacher: "You" }}
              >
                {c.name}
              </ClassroomButton>
            ))}
          </div>
        </>
      ) : null}

      <div className={styles["cbuttons"]}>
        <div
          className="button hover-effect"
          style={{ width: 300 }}
          onClick={() => setPopups((old) => ({ ...old, join: true }))}
        >
          Join a classroom
        </div>
        <div
          className="button hover-effect"
          style={{ width: 300 }}
          onClick={() => setPopups((old) => ({ ...old, classroom: true }))}
        >
          Create a classroom
        </div>
      </div>
    </div>
  );
};

export default ClassroomList;
