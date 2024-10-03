import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅
import styles from "./main.module.css"; // CSS 모듈 사용
import config from "../../config"; // 백엔드 URL을 담은 config 파일 (경로에 맞게 조정)
import chefIcon from "../../assets/chef.png";
import popularIcon from "../../assets/popular-icon.png";
import mfIcon from "../../assets/mf-icon.png";
import fmIcon from "../../assets/fm-icon.png";
import knnIcon from "../../assets/knn-icon.png";
import cbfIcon from "../../assets/cbf-icon.png";

const MainPage = () => {
  const navigate = useNavigate(); // 페이지 이동 훅 선언
  const [recipes, setRecipes] = useState([]); // 레시피 데이터를 저장할 state

  // 인기 레시피 데이터를 가져오는 함수
  const handlePopularRecipesClick = () => {
    const url = `${config.backendUrl}/recommendation/poprec`; // 백엔드 API 경로 설정

    // fetch로 GET 요청
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json()) // 응답 데이터를 JSON으로 변환
      .then((data) => {
        setRecipes(data); // 받아온 데이터를 상태에 저장
        navigate("/recommend", { state: { recipes: data } }); // RecPage로 데이터를 전달하며 이동
      })
      .catch((error) => {
        console.error("Error fetching popular recipes:", error); // 에러 처리
      });
  };

  return (
    <div className={styles.mainPage}>
      {/* 헤더 섹션 */}
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
        />
        <OptionCard
          title="FM으로 추천받기"
          description={
            <>
              레시피의 다양한 특성에 대한 <br /> 상호작용을 바탕으로 추천해줘요
            </>
          }
          icon={fmIcon}
        />
        <OptionCard
          title="KNN으로 추천받기"
          description={
            <>
              나와 취향이 비슷한 다른 사용자가 <br /> 고른 레시피를 추천해줘요
            </>
          }
          icon={knnIcon}
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
        />
      </div>
    </div>
  );
};

// OptionCard 컴포넌트
const OptionCard = ({ title, description, icon }) => {
  return (
    <button className={styles.optionCard}>
      <img src={icon} alt={title} className={styles.optionIcon} />
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  );
};

export default MainPage;
