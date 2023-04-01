import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import style from "./style.module.css";

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
