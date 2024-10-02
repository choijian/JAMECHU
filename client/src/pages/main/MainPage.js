// App.js
import React from "react";
import "./App.css"; // Add styling here

// Main heading component
const MainHeading = () => {
  return (
    <div className="main-heading">
      <h1>나에게 딱 맞는 레시피 추천받기</h1>
      <img src="chef_image_url" alt="Chef cooking" className="chef-img" />
    </div>
  );
};

// Button component
const RecommendationButton = ({ title, description, icon }) => {
  return (
    <div className="recommendation-button">
      <img src={icon} alt={`${title} icon`} className="button-icon" />
      <div className="button-content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

// Main App component
function App() {
  return (
    <div className="App">
      {/* Main Heading */}
      <MainHeading />

      {/* Recommendation Buttons */}
      <div className="recommendation-section">
        <RecommendationButton
          title="인기 레시피 추천받기"
          description="6만개의 레시피 중 가장 인기 있는 5개의 레시피를 추천해드려요"
          icon="popular_icon_url"
        />
        <RecommendationButton
          title="CF로 추천받기"
          description="나와 취향이 비슷한 다른 사용자가 고른 레시피를 추천해줘요"
          icon="cf_icon_url"
        />
        <RecommendationButton
          title="CBF로 추천받기"
          description="내가 선택한 레시피와 유사한 다른 레시피를 추천해줘요"
          icon="cbf_icon_url"
        />
      </div>
    </div>
  );
}

export default App;
