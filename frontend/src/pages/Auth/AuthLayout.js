import React from "react";
import style from "./style.module.css";

import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className={style["container"]}>
      <div>
        <Outlet />
      </div>
      <div>cool thing on right</div>
    </div>
  );
};

export default AuthLayout;
