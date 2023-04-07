import "./App.css";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Exam from "./pages/Exam/Exam";
import Login from "./pages/Auth/Login";
import AuthLayout from "./pages/Auth/AuthLayout";
import Register from "./pages/Auth/Register";
import NavLayout from "./layout/NavLayout";
import ClassroomList from "./pages/ClassroomList/ClassroomList";

function App() {
  return (
    <div>
      <Routes>
        {/* <Route index element={<Home />} /> */}
        <Route element={<NavLayout />}>
          <Route path="classroom/:id" /> 
          <Route path="classrooms" element={<ClassroomList />} />
          <Route path="exam/:id" element={<Exam />} />
          <Route path="profile" />
          <Route path="create" />
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
