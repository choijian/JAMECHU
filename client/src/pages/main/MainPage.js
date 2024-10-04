import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./main.module.css";
import config from "../../config";
import chefIcon from "../../assets/chef.png";
import popularIcon from "../../assets/popular-icon.png";
import mfIcon from "../../assets/mf-icon.png";
import fmIcon from "../../assets/fm-icon.png";
import knnIcon from "../../assets/knn-icon.png";
import cbfIcon from "../../assets/cbf-icon.png";

const MainPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  const handlePopularRecipesClick = () => {
    const url = `${config.backendUrl}/recommendation/poprec`;

    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
        navigate("/recommend", { state: { recipes: data } });
      })
      .catch((error) => {
        console.error("Error fetching popular recipes:", error);
      });
  };

  return (
    <div className={styles.mainPage}>
      <div className={styles.headerSection}>
        <h1>
          나에게 딱 맞는 <br /> 레시피 추천받기
        </h1>
        <img src={chefIcon} alt="Chef Cooking" className={styles.chefImage} />
      </div>

      {/* 인기 레시피 섹션 */}
      <button
        className={styles.popularRecipe}
        onClick={handlePopularRecipesClick}
      >
        <img src={popularIcon} alt="Popular Icon" className={styles.icon} />
        <div>
          <h2>인기 레시피 추천받기</h2>
          <p>가장 인기 있는 5개의 레시피를 추천해드려요</p>
        </div>
      </button>

      {/* 추천 옵션 섹션 */}
      <div className={styles.recommendationOptions}>
        <OptionCard
          title="MF로 추천받기"
          description={
            <>
              레시피의 잠재 요인을 반영하여 <br /> 유사한 레시피를 추천해줘요
            </>
          }
          icon={mfIcon}
          onClick={() => navigate("/select", { state: { model_id: "MF" } })}
        />
        <OptionCard
          title="FM으로 추천받기"
          description={
            <>
              레시피의 다양한 특성에 대한 <br /> 상호작용을 바탕으로 추천해줘요
            </>
          }
          icon={fmIcon}
          onClick={() => navigate("/select", { state: { model_id: "FM" } })}
        />
        <OptionCard
          title="KNN으로 추천받기"
          description={
            <>
              나와 취향이 비슷한 다른 사용자가 <br /> 고른 레시피를 추천해줘요
            </>
          }
          icon={knnIcon}
          onClick={() => navigate("/select", { state: { model_id: "KNN" } })}
        />
        <OptionCard
          title="CBF로 추천받기"
          description={
            <>
              내가 선택한 레시피와 유사한
              <br /> 다른 레시피를 추천해줘요
            </>
          }
          icon={cbfIcon}
          onClick={() => navigate("/select", { state: { model_id: "CBF" } })}
        />
      </div>
    </div>
  );
};

const OptionCard = ({ title, description, icon, onClick }) => {
  return (
    <button className={styles.optionCard} onClick={onClick}>
      <img src={icon} alt={title} className={styles.optionIcon} />
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  );
};

export default MainPage;
