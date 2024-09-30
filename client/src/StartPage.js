// src/StartPage.js
import React from "react";
import styled from "styled-components";
import startButtonImage from "./assets/start_button.png"; // 버튼 이미지 import
import backgroundImage from "./assets/start_background.png"; // 배경 이미지 import

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url(${backgroundImage}) no-repeat center center;
  background-size: cover; /* 배경 이미지 크기 조절 */
  color: white;
  font-family: "Arial", sans-serif;
  position: relative; /* 자식 요소의 위치 조정을 위해 */
`;

const Button = styled.button`
  padding: 0;
  width: 12.0625rem;
  height: 3.61344rem;
  flex-shrink: 0;
  border: none;
  border-radius: 22px;
  background: url(${startButtonImage}) no-repeat center center;
  background-size: cover; /* 이미지 크기를 버튼에 맞게 조절 */
  cursor: pointer;
  margin-top: 20px; /* 버튼과 제목 간격 조정 */
  position: absolute; /* 절대 위치 설정 */
  bottom: 110px; /* 바닥에서 20px 위로 위치 설정 */
`;

const StartPage = () => {
  return (
    <Container>
      <Button onClick={() => alert("시작하기 클릭!")}></Button>
    </Container>
  );
};

export default StartPage;
