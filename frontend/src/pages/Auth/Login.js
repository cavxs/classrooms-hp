import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import style from "./style.module.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({});
  const [errMsg, setErr] = useState(null);

  const { login } = useContext(AuthContext);

  const submit = (e) => {
    e.preventDefault();
    login(formData["username"], formData["password"], (err) => {
      if (err === 401) {
        // unauthorized
        setErr("Username or password incorrect");
      }
    });
  };
  const formInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <h1 className="big-heading" style={{ color: "#8d4312", marginBottom: 0 }}>
        Login
      </h1>
      <form className={style["form"]} onSubmit={submit}>
        <input
          type="text"
          name="username"
          className={style["tinput"]}
          onChange={formInput}
          required
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          className={style["tinput"]}
          onChange={formInput}
          required
          placeholder="Password"
        />
        <p>
          Don't have an account? <Link to="/register">Register.</Link>
        </p>
        {errMsg && (
          <p style={{ color: "red", fontWeight: "bold", margin: "10px 0 0 0" }}>
            {errMsg}
          </p>
        )}
        <input type="submit" className={style["submit"]} value="Login" />
      </form>
    </>
  );
};

export default Login;

// design from https://codepen.io/Mohuth/pen/QWgrPvp
