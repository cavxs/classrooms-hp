import { useState, useEffect, useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import styles from "./styles.module.css";
import { AuthContext } from "../context/AuthContext";
import Popup from "../components/Popup/Popup";

const NavigationBar = ({ sl }) => {
  const { user } = useContext(AuthContext);
  return (
    <nav style={styles["nav"]}>
      <ul style={styles[""]}>
        <li>
          <NavLink
            to="exams"
            className={({ isActive, isPending }) =>
              isActive ? styles["navlinkactive"] : ""
            }
          >
            Exams
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/classrooms"
            className={({ isActive, isPending }) =>
              isActive ? styles["navlinkactive"] : ""
            }
          >
            Classrooms
          </NavLink>
        </li>
        <li>
          <div onClick={() => sl(true)}>
            {user ? "@" + user.username : "Profile"}
          </div>
        </li>
      </ul>
    </nav>
  );
};

const NavLayout = () => {
  const [loutpop, showLogout] = useState(false);
  const { logout, user } = useContext(AuthContext);
  return (
    <div>
      <NavigationBar sl={showLogout} />
      <Outlet />
      {loutpop && (
        <Popup
          title="Logout"
          text={`Are you sure you wanna log out from ${user?.username}?`}
          buttons={[
            { text: "Cancel" },
            {
              text: "Logout",
              click: () => {
                logout(true);
              },
            },
          ]}
          shown={(v) => showLogout(v)}
        />
      )}
    </div>
  );
};

export default NavLayout;
