import React from "react";
import styles from "./start.module.css";
import backgroundImage from "../../assets/start_background.png"; // 배경 이미지 import

const StartPage = () => {
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${backgroundImage})` }} // 배경 이미지 인라인으로 설정
    >
      <button className={styles.button} onClick={() => alert("시작하기 클릭!")}>
        시작하기 {/* 버튼 텍스트 */}
      </button>
    </div>
  );
};

export default StartPage;
