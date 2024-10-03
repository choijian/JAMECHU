import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartPage from "./pages/start/StartPage"; // 경로 확인 필요
import MainPage from "./pages/main/MainPage"; // 경로 확인 필요
import RecPage from "./pages/recommend/RecPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/recommend" element={<RecPage />} />
      </Routes>
    </Router>
  );
};

export default App;
