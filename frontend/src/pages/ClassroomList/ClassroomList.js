import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";

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

const ClassroomButton = ({cinfo, nav}) => {
  return (
    <div className={styles["classroom-wrapper"]}>
  <div onClick={nav} className={styles["classroom"]}>
    <div>

    <h2>{cinfo.name}</h2>
    </div>
  </div>
    </div>
  );
}

const ClassroomList = () => {
  const [popup, setPopup] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const { apx } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    apx.get("classrooms/").then((r) => {
      setClassrooms(r.data);
    });
  }, []);

  return (
    <div>
      {popup && <ClassroomCreation closepopup={() => setPopup("")} />}
      <div className={styles["classrooms"]}>
        {classrooms.length ? (
          classrooms.map((c, i) => <ClassroomButton key={i} nav={()=> navigate(`/classroom/${c.id}`)} cinfo={{name:c.name}}>{c.name}</ClassroomButton>)
        ) : (
          <h2>No classrooms</h2>
        )}
      </div>

      <div className={styles["cbuttons"]}>
        <div>Join a classroom</div>
        <div onClick={() => setPopup("classroom")}>Create a classroom</div>
      </div>
    </div>
  );
};

export default ClassroomList;
