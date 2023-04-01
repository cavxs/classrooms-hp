import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import style from "./style.module.css";

const Register = () => {
  const [formData, setFormData] = useState({});

  const { register } = useContext(AuthContext);

  const submit = (e) => {
    e.preventDefault();
    console.log(formData);
    register(
      formData["first_name"],
      formData["last_name"],
      formData["username"],
      formData["password"],
      formData["password2"]
    );
  };
  const formInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <form className={style["form"]} onSubmit={submit}>
        <input
          type="text"
          name="first_name"
          className={style["tinput"]}
          onChange={formInput}
          required
          placeholder="First name"
        />
        <input
          type="text"
          name="last_name"
          className={style["tinput"]}
          onChange={formInput}
          required
          placeholder="Last name"
        />
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
        <input
          type="password"
          name="password2"
          className={style["tinput"]}
          onChange={formInput}
          required
          placeholder="Password again"
        />
        <input type="submit" className={style["submit"]} value="Register" />
      </form>
    </>
  );
};

export default Register;

// design from https://codepen.io/Mohuth/pen/QWgrPvp
