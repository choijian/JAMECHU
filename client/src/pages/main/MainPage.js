import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./main.module.css";
import config from "../../config";
import chefIcon from "../../assets/chef.png";
import popularIcon from "../../assets/popular-icon.png";
import fmIcon from "../../assets/fm-icon.png";
import knnIcon from "../../assets/knn-icon.png";
import cbfIcon from "../../assets/cbf-icon.png";

const MainPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handlePopularRecipesClick = () => {
    setLoading(true); // 로딩 시작
    const url = `${config.backendUrl}/recommendation/poprec`;

    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false); // 로딩 완료
        navigate("/recommend", { state: { recommendations: data } });
      })
      .catch((error) => {
        console.error("Error fetching popular recipes:", error);
        setLoading(false); // 에러 발생 시 로딩 종료
      });
  };

  // model 선택에 따라 페이지 이동 처리
  const handleSelectModel = (model_id) => {
    setLoading(true); // 로딩 시작
    setTimeout(() => {
      setLoading(false); // 일정 시간이 지나면 로딩 완료 (데이터를 불러오는 과정은 생략)
      navigate("/select", { state: { model_id } });
    }, 500); // 0.5초 후에 페이지 이동
  };

  return (
    <div className={styles.mainPage}>
      {/* 로딩 중일 때 스피너 표시 */}
      {loading ? (
        <div className={styles.spinner}></div> // 스피너 추가
      ) : (
        <>
          <div className={styles.headerSection}>
            <h1>
              나에게 딱 맞는 <br /> 레시피 추천받기
            </h1>
            <img
              src={chefIcon}
              alt="Chef Cooking"
              className={styles.chefImage}
            />
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
              title="FM으로 추천받기"
              description={
                <>
                  레시피의 다양한 특성에 대한 <br /> 상호작용을 바탕으로
                  추천해줘요
                </>
              }
              icon={fmIcon}
              onClick={() => handleSelectModel("FM")}
            />
            <OptionCard
              title="KNN으로 추천받기"
              description={
                <>
                  나와 취향이 비슷한 다른 사용자가 <br /> 고른 레시피를
                  추천해줘요
                </>
              }
              icon={knnIcon}
              onClick={() => handleSelectModel("KNN")}
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
              onClick={() => handleSelectModel("CBF")}
            />
          </div>
        </>
      )}
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
