import React from "react";
import styles from "./style.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles["container"]}>
      <h1 className="big-heading">Oops! Page Not Found</h1>
      <p className={styles["message"]}>
        We're sorry, but the page you requested could not be found. Please check
        the URL or go back to the homepage.
      </p>
      <a href="/" className={styles["link"]}>
        Go back to the homepage
      </a>
    </div>
  );
};

export default NotFoundPage;
