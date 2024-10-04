import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./rec.module.css";
import starIcon from "../../assets/star-icon.png";
import clockIcon from "../../assets/clock-icon.png";
import commentIcon from "../../assets/comment-icon.png";
import heartFilled from "../../assets/heart-filled.png";
import heartEmpty from "../../assets/heart-empty.png";
import config from "../../config"; // config 파일에서 backendUrl 가져오기

const RecPage = () => {
  const location = useLocation(); // 페이지로 전달된 데이터 가져오기
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]); // 빈 배열로 초기화하여 안전한 렌더링 보장
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    if (
      location.state?.recommendations &&
      Array.isArray(location.state.recommendations)
    ) {
      setRecipes(location.state.recommendations);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [location.state]);

  // "뒤로 가기" 버튼 클릭 시 MainPage로 이동
  const handleBackClick = () => {
    navigate("/main"); // MainPage 경로로 이동
  };

  return (
    <div className={styles.pageContainer}>
      {/* 뒤로 가기 버튼 */}
      <div className={styles.backButtonContainer}>
        <button className={styles.backButton} onClick={handleBackClick}>
          &#60;
        </button>
      </div>
      <h1 className={styles.title}>추천 레시피 보기</h1>
      <p className={styles.subTitle}>AI가 추천해주는 맞춤형 레시피입니다.</p>

      {loading ? (
        <div className={styles.spinner}></div> // 스피너 표시
      ) : recipes.length > 0 ? (
        recipes.map((recipe) => (
          <RecipeCard key={recipe.recipe_id} recipe={recipe} />
        ))
      ) : (
        <p>레시피 데이터가 없습니다.</p>
      )}
    </div>
  );
};

// 개별 레시피 카드 컴포넌트
const RecipeCard = ({ recipe }) => {
  const { name, mean_rating, minutes, recipe_count } = recipe;

  const [isFavorite, setIsFavorite] = useState(recipe.favorite || false);

  const handleHeartClick = () => {
    setIsFavorite(!isFavorite); // 현재 상태를 반대로 변경
  };

  const navigate = useNavigate();

  const handleDetailClick = async () => {
    try {
      const response = await axios.post(
        `${config.backendUrl}/recommendation/recipe-detail`,
        { recipe_id: recipe.recipe_id }
      );
      navigate("/recipedetail", { state: { recipeDetail: response.data } });
    } catch (error) {
      console.error("레시피 상세 정보를 불러오는 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.recipeName}>{name}</h2>
        <img
          src={isFavorite ? heartFilled : heartEmpty}
          alt={isFavorite ? "favorite" : "not favorite"}
          className={styles.heartIcon}
          onClick={handleHeartClick}
        />
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.ratingInfo}>
          <img src={starIcon} alt="rating" className={styles.starIcon} />
          <span>{mean_rating}</span>
        </div>
        <div className={styles.timeInfo}>
          <img src={clockIcon} alt="time" className={styles.icon} />
          <span>{minutes} 분</span>
        </div>
        <div className={styles.commentInfo}>
          <img src={commentIcon} alt="comments" className={styles.icon} />
          <span>{recipe_count} 댓글</span>
        </div>
      </div>

      <button className={styles.detailButton} onClick={handleDetailClick}>
        레시피 상세 보기
      </button>
    </div>
  );
};

export default RecPage;
