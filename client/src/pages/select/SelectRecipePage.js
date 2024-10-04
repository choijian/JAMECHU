import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./select.module.css";
import config from "../../config";
import chickenPasta from "../../assets/chicken-pasta.png";
import spicyShrimp from "../../assets/spicy-shrimp.png";
import frenchToast from "../../assets/french-toast.png";
import avocadoSushi from "../../assets/avocado-sushi.png";
import beefBroccoli from "../../assets/beef-broccoli.png";
import baconFriedRice from "../../assets/bacon-fried-rice.png";
import caesarSalad from "../../assets/caesar-salad.png";
import creamGalicPasta from "../../assets/cream-galic-pasta.png";
import peanutButter from "../../assets/peanut-butter.png";
import blackPepperChicken from "../../assets/black-pepper-chicken.png";

const RecipeSelect = () => {
  const location = useLocation();
  const model_id = location.state?.model_id || ""; // MainPage에서 넘어온 model_id
  const [recipe_ids, setRecipeIds] = useState([]); // 선택한 recipe_id를 저장할 상태
  const navigate = useNavigate();

  // 예시 레시피 데이터 (각 이미지 경로 포함)
  const recipes = [
    { recipe_id: "39087", image: chickenPasta },
    { recipe_id: "107997", image: spicyShrimp },
    { recipe_id: "90674", image: frenchToast },
    { recipe_id: "161198", image: avocadoSushi },
    { recipe_id: "99476", image: beefBroccoli },
    { recipe_id: "52190", image: baconFriedRice },
    { recipe_id: "116849", image: caesarSalad },
    { recipe_id: "43023", image: creamGalicPasta },
    { recipe_id: "29679", image: peanutButter },
    { recipe_id: "45308", image: blackPepperChicken },
  ];

  // 레시피 선택 처리
  const handleRecipeSelect = (recipe_id) => {
    if (recipe_ids.includes(recipe_id)) {
      setRecipeIds(recipe_ids.filter((id) => id !== recipe_id));
    } else if (recipe_ids.length < 3) {
      setRecipeIds([...recipe_ids, recipe_id]);
    } else {
      alert("3개의 레시피만 선택할 수 있습니다.");
    }
  };

  // 제출 버튼 클릭 시 POST 요청
  const handleSubmit = async () => {
    if (recipe_ids.length === 3) {
      try {
        // model_id와 recipe_ids를 함께 POST 요청으로 전송
        const response = await axios.post(
          `${config.backendUrl}/recommendation/recommend-recipe`, // 변경된 엔드포인트
          {
            model_id, // 선택된 모델
            recipe_ids, // 선택된 레시피들
          }
        );
        console.log(response.data);
        navigate("/recommendation-result", {
          state: { recommendations: response.data },
        }); // 추천 결과 페이지로 이동하며 결과 전달
      } catch (error) {
        console.error("레시피 추천 중 오류가 발생했습니다.", error);
      }
    } else {
      alert("3개의 레시피를 선택해주세요.");
    }
  };

  // 뒤로가기 버튼 처리
  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className={styles.pageContainer}>
      {/* 뒤로가기 버튼 */}
      <button className={styles.backButton} onClick={handleBackClick}>
        &lt;
      </button>

      <h1 className={styles.title}>선호 레시피 고르기</h1>
      <div>
        <p className={styles.subTitle}>
          가장 관심이 가는 메뉴 3가지를 골라주세요.
        </p>
      </div>

      <div className={styles.recipeGrid}>
        {recipes.map((recipe) => (
          <button
            key={recipe.recipe_id}
            className={`${styles.recipeButton} ${
              recipe_ids.includes(recipe.recipe_id) ? styles.selected : ""
            }`}
            onClick={() => handleRecipeSelect(recipe.recipe_id)}
            style={{ backgroundImage: `url(${recipe.image})` }} // 이미지를 버튼 배경으로 설정
          >
            {/* 버튼에 이미지만 사용 */}
          </button>
        ))}
      </div>

      <button className={styles.submitButton} onClick={handleSubmit}>
        제출하기
      </button>
    </div>
  );
};

export default RecipeSelect;
