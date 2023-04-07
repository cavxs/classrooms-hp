import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const authAxios = axios.create({
    baseURL: "http://localhost:8000/api/auth",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const apx = axios.create({
    baseURL: "http://localhost:8000/api/",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // if there is an error in the response of apx (which is the main axios instance used to com. with the server)
  // then check if the error is unauthorized access in which case we use the refresh token again to geneerate a new access token

  

  const storedTokens = JSON.parse(localStorage.getItem("authTokens")) || null;

  const [authTokens, setAuthTokens] = useState(storedTokens);
  const [user, setUser] = useState(
    storedTokens ? jwtDecode(storedTokens.access) : null
  );

  const getAccessT = () => authTokens?.access || null;

  // if get access token is not null, set it to AT and use it in the CHANGE THE AUTHAXIOS TO THE API AXIOS
  let AT = null;
  if ((AT = getAccessT()))
    apx.defaults.headers.common["Authorization"] = `Bearer ${AT}`;
  /**
   *
   * @param {object} tokens this should always include an access token, and optionally a refresh token
   */
  const saveTokens = (tokens) => {
    if (!tokens.access)
      throw new Error(
        "There is no access token passed to the saveTokens function."
      );
    const newtokens = { ...authTokens, ...tokens }
    setAuthTokens(newtokens);
    // decode and store the user
    setUser(jwtDecode(tokens.access));
    // store the tokens to the local storage
    localStorage.setItem("authTokens", JSON.stringify(newtokens));
  };

  const navigate = useNavigate();

  const login = async (username, password, error) => {
    try {
      const res = await authAxios.post("/login/", { username, password });
      navigate("/", { replace: true });
      saveTokens(res.data);
    } catch (err) {
      // console.error(err);
      if (error) error(err.response.status);
    }
  };

  const logout = (login = false) => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    if (login) return navigate("/login");
    navigate("/");
  };

  const register = async (
    first_name,
    last_name,
    username,
    password,
    password2
  ) => {
    if (password != password2)
      throw new Error("The passwords are not the same");
    try {
      const res = await authAxios.post("/register/", {
        first_name,
        last_name,
        username,
        password,
        password2,
      });
      navigate("/", { replace: true });
      saveTokens(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authAxios.get("/refresh/");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  apx.interceptors.response.use((res)=> {
    return res;
  }, (err) =>{
    // check if the error is unauthorized access
    if (err.response.status === 401) {
      // generate a new access token and try again
      console.log("there is a 401 error");
      console.log(authTokens);
      return authAxios.post('/refresh/', {"refresh": authTokens?.refresh})
        .then((res) => {
          // got the access token as res
          saveTokens(res.data)
          // get and return the data that i needed in the beginning
          err.config.headers['Authorization'] = 'Bearer ' + res.data.access;
          return apx.request(err.config);
        })
        .catch(function (error) {
          // todo: make the failure to get access token. send to login page possibly.
          console.log(error);
          logout(true)
          return;
        });
    }
  })
  const cData = {
    user,
    register,
    login,
    logout,
    apx,
  };

  return <AuthContext.Provider value={cData}>{children}</AuthContext.Provider>;
};
