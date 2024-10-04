import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartPage from "./pages/start/StartPage"; // 경로 확인 필요
import MainPage from "./pages/main/MainPage"; // 경로 확인 필요
import RecPage from "./pages/recommend/RecPage";
import DetailPage from "./pages/detail/DetailPage";
import SelectRecipePage from "./pages/select/SelectRecipePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/recommend" element={<RecPage />} />
        <Route path="/select" element={<SelectRecipePage />} />
        <Route path="/recipedetail" element={<DetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
