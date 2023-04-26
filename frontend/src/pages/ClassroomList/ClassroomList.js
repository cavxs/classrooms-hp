import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popup/Popup";

const ClassroomCreation = ({ closepopup }) => {
  const [name, setName] = useState("");
  const { apx } = useContext(AuthContext);

  const onSubmit = (e) => {
    e.preventDefault();
    // send a creation request to the server which will be handled by the creation of a classroom in the database
    console.log(apx);
    apx.post("classrooms/", { name });
  };
  return (
    <>
      <Overlay closepopup={closepopup} />
      <div className={styles["popup"]}>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Classroom name"
          />
          <input type="submit" />
        </form>
        <button onClick={closepopup}>Cancel</button>
      </div>
    </>
  );
};

const Overlay = ({ closepopup }) => (
  <div onClick={closepopup} className={styles["overlay"]}></div>
);

const ClassroomButton = ({ cinfo, nav }) => {
  return (
    <div className={styles["classroom-wrapper"]}>
      <div onClick={nav} className={styles["classroom"]}>
        <div>
          <h2>{cinfo.name}</h2>
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

  const navigate = useNavigate();

  useEffect(() => {
    apx.get("classrooms/").then((r) => {
      if (r?.data) {
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
        <ClassroomCreation
          closepopup={() => setPopups((old) => ({ ...old, classroom: false }))}
        />
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
                    setClassrooms((old) => [...old, res.data]);
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
      {classrooms.non_owner?.length && (
        <>
          <h1>Joined Classrooms</h1>
          <div className={styles["classrooms"]}>
            {classrooms.non_owner.map((c, i) => (
              <ClassroomButton
                key={i}
                nav={() => navigate(`/classroom/${c.id}`)}
                cinfo={{ name: c.name }}
              >
                {c.name}
              </ClassroomButton>
            ))}
          </div>
        </>
      )}

      {classrooms.owner?.length && (
        <>
          <h1>Created Classrooms</h1>
          <div className={styles["classrooms"]}>
            {classrooms.owner.map((c, i) => (
              <ClassroomButton
                key={i}
                nav={() => navigate(`/classroom/${c.id}`)}
                cinfo={{ name: c.name }}
              >
                {c.name}
              </ClassroomButton>
            ))}
          </div>
        </>
      )}

      <div className={styles["cbuttons"]}>
        <div onClick={() => setPopups((old) => ({ ...old, join: true }))}>
          Join a classroom
        </div>
        <div onClick={() => setPopups((old) => ({ ...old, classroom: true }))}>
          Create a classroom
        </div>
      </div>
    </div>
  );
};

export default ClassroomList;
