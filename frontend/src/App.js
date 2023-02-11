import "./App.css";

import { Routes, Route } from "react-router-dom";
import Exam from "./pages/Exam/Exam";

function App() {
  return (
    <div>
      <Routes>
        <Route path="classroom/:id" />
        <Route path="exam/:id" element={<Exam />} />
        <Route path="profile" />
        <Route path="create" />
      </Routes>
    </div>
  );
}

export default App;
