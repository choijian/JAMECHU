import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // axios를 사용하여 POST 요청을 보냅니다.
import styles from "./rec.module.css";
import starIcon from "../../assets/star-icon.png"; // 별 아이콘
import clockIcon from "../../assets/clock-icon.png"; // 시간 아이콘
import commentIcon from "../../assets/comment-icon.png"; // 댓글 아이콘
import heartFilled from "../../assets/heart-filled.png"; // 채워진 하트 아이콘
import heartEmpty from "../../assets/heart-empty.png"; // 빈 하트 아이콘

// 백엔드 URL을 config에서 가져옵니다.
import config from "../../config"; // config 파일에서 backendUrl 가져오기

const RecPage = () => {
  const location = useLocation(); // 페이지로 전달된 데이터 가져오기
  const navigate = useNavigate(); // 뒤로 가기 위한 navigate 함수
  const { recipes } = location.state || {}; // 전달된 데이터에서 recipes 배열 가져오기

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

      {recipes && recipes.length > 0 ? (
        recipes.map((recipe) => (
          <RecipeCard key={recipe.recipe_id} recipe={recipe} />
        ))
      ) : (
        <p>레시피 데이터를 불러오는 중입니다...</p>
      )}
    </div>
  );
};

// 개별 레시피 카드 컴포넌트
const RecipeCard = ({ recipe }) => {
  const { name, mean_rating, minutes, recipe_count } = recipe;

  // 하트(좋아요) 상태 관리
  const [isFavorite, setIsFavorite] = useState(recipe.favorite || false);

  // 하트 클릭 시 상태 변경 함수
  const handleHeartClick = () => {
    setIsFavorite(!isFavorite); // 현재 상태를 반대로 변경
  };

  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

  // "레시피 상세 보기" 클릭 시 POST 요청
  const handleDetailClick = async () => {
    try {
      const response = await axios.post(
        `${config.backendUrl}/recommendation/recipe-detail`,
        {
          recipe_id: recipe.recipe_id,
        }
      );

      // 서버로부터 데이터를 성공적으로 받아오면 recipedetail 페이지로 이동하면서 데이터 전달
      navigate("/recipedetail", { state: { recipeDetail: response.data } });
    } catch (error) {
      console.error("레시피 상세 정보를 불러오는 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.recipeName}>{name}</h2>
        {/* 하트 아이콘 클릭 시 상태 변경 */}
        <img
          src={isFavorite ? heartFilled : heartEmpty}
          alt={isFavorite ? "favorite" : "not favorite"}
          className={styles.heartIcon}
          onClick={handleHeartClick}
        />
      </div>

      {/* 평점, 시간, 댓글 정보를 같은 라인에 배치 */}
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
