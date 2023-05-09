import "./App.css";

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Exam from "./pages/Exam/Exam";
import Login from "./pages/Auth/Login";
import AuthLayout from "./pages/Auth/AuthLayout";
import Register from "./pages/Auth/Register";
import NavLayout from "./layout/NavLayout";
import ClassroomList from "./pages/ClassroomList/ClassroomList";
import PrivateRoutes from "./context/PrivateRoutes";
import Classroom from "./pages/Classroom/Classroom";
import ExamMaker from "./pages/ExamMaker/ExamMaker";
import Exams from "./pages/Exams/Exams";
import Answers from "./pages/Answers/Answers";
import Check from "./pages/Check/Check";
import NotFoundPage from "./pages/PageNotFound/PageNotFound";

function App() {
  return (
    <div>
      <Routes>
        {/* <Route index element={<Home />} /> */}
        <Route element={<NavLayout />}>
          <Route element={<PrivateRoutes />}>
            <Route index element={<Home />} />
            <Route path="classrooms" element={<ClassroomList />} />
            <Route path="classroom/:id" element={<Classroom />} />
            <Route path="exam/:id" element={<Exam />} />
            <Route path="exam/:id/answers" element={<Answers />} />
            <Route path="exam/:id/check" element={<Check />} />
            <Route path="exam/:id/check/:qid" element={<Check />} />
            <Route path="exams" element={<Exams />} />
            <Route path="profile" />
            <Route path="make" element={<ExamMaker />} />
            <Route path="make/:id" element={<ExamMaker />} />
          </Route>
        </Route>
        <Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
