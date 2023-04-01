import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
const Home = () => {
  const { apx, user } = useContext(AuthContext);
  const [userData, setUserData] = useState({ first_name: "" });
  useEffect(() => {
    // get the information of the user.
    // console.log(user.user_id);
    apx.get(`users/${user.user_id}/`).then((res) => {
      setUserData({ ...userData, ...res.data });
    });
  }, []);

  return <h1>Welcome, {userData.first_name}!</h1>;
};

export default Home;
