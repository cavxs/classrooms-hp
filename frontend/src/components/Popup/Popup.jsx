import React, { useState } from "react";
import styles from "./style.module.css";

const Popup = ({
  title = "unnamed",
  text = "",
  buttons = [{ text: "Ok", click: "close" }],
  shown,
  children,
}) => {
  return (
    <div className={styles["main"]}>
      <div className={styles["overlay"]} onClick={() => shown(false)}></div>
      <div className={styles["window"]}>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
        {children}
        <div className={styles["buttons"]}>
          {buttons.map((b, i) => (
            <button key={i} onClick={b.click || (() => shown(false))}>
              {b.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popup;
