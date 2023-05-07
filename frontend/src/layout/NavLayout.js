import { useState, useEffect, useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import styles from "./styles.module.css";
import { AuthContext } from "../context/AuthContext";

const NavigationBar = () => {
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
          <NavLink>{user ? "@" + user.username : "Profile"}</NavLink>
        </li>
      </ul>
    </nav>
  );
};

const NavLayout = () => {
  return (
    <div>
      <NavigationBar />
      <Outlet />
    </div>
  );
};

export default NavLayout;
