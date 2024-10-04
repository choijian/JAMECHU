import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./detail.module.css";
import timeIcon from "../../assets/clock-icon2.png"; // 시간 아이콘
import reviewIcon from "../../assets/comment-icon2.png"; // 리뷰 아이콘
import ratingIcon from "../../assets/star-icon2.png"; // 평점 아이콘

const DetailPage = () => {
  const location = useLocation();
  const { recipeDetail } = location.state; // 이전 페이지에서 전달된 데이터 받기
  const [steps, setSteps] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (recipeDetail) {
      // steps 데이터를 , 기준으로 분리하고 줄바꿈 및 넘버링
      const formattedSteps = recipeDetail.steps
        .slice(1, -1) // 양쪽 끝의 대괄호 제거
        .split(",") // ,로 분리
        .map((step, index) => `${index + 1}. ${step.trim()}`);
      setSteps(formattedSteps);

      // ingredients 데이터를 , 기준으로 분리하여 줄바꿈
      const formattedIngredients = recipeDetail.ingredients
        .slice(1, -1) // 양쪽 끝의 대괄호 제거
        .split(",") // ,로 분리
        .map((ingredient) => ingredient.trim());
      setIngredients(formattedIngredients);
    }
  }, [recipeDetail]);

  return (
    <div className={styles.detailPage}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        &lt;
      </button>

      <h1>{recipeDetail.name}</h1>

      <div className={styles.iconContainer}>
        <div className={`${styles.iconItem} ${styles.time}`}>
          <img src={timeIcon} alt="Time Icon" className={styles.icon} />
          <p>{recipeDetail.minutes}분</p>
        </div>
        <div className={`${styles.iconItem} ${styles.review}`}>
          <img src={reviewIcon} alt="Review Icon" className={styles.icon} />
          <p>{recipeDetail.recipe_count}개</p>
        </div>
        <div className={`${styles.iconItem} ${styles.rating}`}>
          <img src={ratingIcon} alt="Rating Icon" className={styles.icon} />
          <p>{recipeDetail.mean_rating}점</p>
        </div>
      </div>

      <div className={styles.nutrition}>
        <h2>영양 성분</h2>
        <p>칼로리(kcal) : {recipeDetail.calories}</p>
        <p>단백질(g) : {recipeDetail.protein}</p>
        <p>지방(g) : {recipeDetail.total_fat}</p>
        <p>포화지방(g) : {recipeDetail.saturated_fat}</p>
        <p>설탕(g) : {recipeDetail.sugar}</p>
        <p>나트륨(mg) : {recipeDetail.sodium}</p>
        <p>탄수화물(g) : {recipeDetail.carboydrates}</p>
      </div>

      <div className={styles.ingredients}>
        <h2>재료</h2>
        {ingredients.map((ingredient, index) => (
          <p key={index}>{ingredient}</p>
        ))}
      </div>

      <div className={styles.steps}>
        <h2>스텝</h2>
        {steps.map((step, index) => (
          <p key={index}>{step}</p>
        ))}
      </div>
    </div>
  );
};

export default DetailPage;
