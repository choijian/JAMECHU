import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 import
import styles from "./start.module.css";
import backgroundImage from "../../assets/start_background.png"; // 배경 이미지 import

const StartPage = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleStartClick = () => {
    navigate("/main"); // /main 경로로 이동
  };

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${backgroundImage})` }} // 배경 이미지 인라인으로 설정
    >
      <button className={styles.button} onClick={handleStartClick}>
        시작하기 {/* 버튼 텍스트 */}
      </button>
    </div>
  );
};

export default StartPage;
