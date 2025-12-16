// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Qrscan from "@/components/Qrscan";
import {
  loadExperiences,
  saveExperiences,
  loadChallenges,
  saveChallenges,
  StatusMap, // utils/cookie.ts 에서 export된 타입을 사용
} from "@/utils/cookie";

// --- 렌더링 유틸리티 함수 (Page 컴포넌트 내부에서만 사용) ---

const getStatusClasses = (isCompleted: boolean) => {
  return isCompleted
    ? "bg-cyan-400 shadow-lg py-2 rounded-3xl text-center"
    : "bg-amber-400 shadow-lg py-2 rounded-3xl text-center";
};

const getStatusText = (isCompleted: boolean) => {
  return isCompleted ? "체험 완료" : "체험 미완료";
};

const getChallengeText = (isCompleted: boolean) => {
  return isCompleted ? "달성" : "미달성";
};

// --- 메인 클라이언트 컴포넌트 ---

export default function Home() {
  const [experiences, setExperiences] = useState<StatusMap>({});
  const [challenges, setChallenges] = useState<StatusMap>({});
  const [isLoaded, setIsLoaded] = useState(false); // 쿠키 로드 상태

  // 1. 컴포넌트 마운트 시 쿠키에서 상태 로드
  useEffect(() => {
    setExperiences(loadExperiences());
    setChallenges(loadChallenges());
    setIsLoaded(true);
  }, []);

  /**
   * QR 스캔 결과를 처리하고 상태를 업데이트하는 함수
   */
  const handleScanResult = (qrValue: string) => {
    let updated = false;

    // 1. 체험 상태 업데이트 로직
    setExperiences((prev) => {
      let newState = { ...prev };
      if (
        qrValue === "GCB//PAYLOAD//0000CMD0000PASS" &&
        !prev.command.completed
      ) {
        newState.command = { ...prev.command, completed: true };
        updated = true;
        alert("커맨드 체험 완료!");
      } else if (
        qrValue === "GCB//PAYLOAD//WEB00000000PASS" &&
        !prev.web.completed
      ) {
        newState.web = { ...prev.web, completed: true };
        updated = true;
        alert("웹 체험 완료!");
      } else if (
        qrValue === "GCB//PAYLOAD//00000000GAMEPASS" &&
        !prev.game.completed
      ) {
        newState.game = { ...prev.game, completed: true };
        updated = true;
        alert("게임 체험 완료!");
      }
      // 상태 변경이 일어났다면 쿠키에 저장
      if (updated) {
        saveExperiences(newState);
      }
      return newState;
    });

    // 2. 도전과제 상태 업데이트 로직
    setChallenges((prev) => {
      let newState = { ...prev };
      if (
        qrValue === "GCB//PAYLOAD//SUBS//GAME00PASS//001" &&
        !prev.challenge1.completed
      ) {
        newState.challenge1 = { ...prev.challenge1, completed: true };
        updated = true;
        alert("도전과제 1 달성!");
      } else if (
        qrValue === "GCB//PAYLOAD//SUBS//GAME00PASS//030" &&
        !prev.challenge3.completed
      ) {
        newState.challenge3 = { ...prev.challenge3, completed: true };
        updated = true;
        alert("도전과제 3 달성!");
      } else if (
        qrValue === "GCB//PAYLOAD//SUBS//GAME00PASS//200" &&
        !prev.challenge2.completed
      ) {
        newState.challenge2 = { ...prev.challenge2, completed: true };
        updated = true;
        alert("도전과제 2 달성!");
      }
      // 상태 변경이 일어났다면 쿠키에 저장
      if (updated) {
        saveChallenges(newState);
      }
      return newState;
    });
  };

  // 쿠키 로딩 중에는 빈 화면 또는 로딩 표시
  if (!isLoaded) {
    return (
      // 🌟 수정: flex flex-col items-center justify-center를 사용하여 수직 중앙 정렬
      <div className="min-h-screen w-full flex flex-col items-center justify-center text-center p-10">
        {/* 1. 로딩 스피너 (원) */}
        <svg
          className="animate-spin h-8 w-8 text-black mb-3" // 🌟 mb-3으로 텍스트와 간격 추가
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>

        {/* 2. 텍스트 */}
        <div className="text-bold text-xl">앱을 불러오고 있어요.</div>
        <div className="mt-30 nh text-xl">Now Loading...</div>
      </div>
    );
  }

  const experienceArray = Object.values(experiences);
  const challengeArray = Object.values(challenges);

  return (
    <div className="w-full h-full p-3">
      {/* 1. 타이틀 영역 */}
      <div className="p-5 mt-2 bg-slate-100/90 rounded-3xl shadow-2xl">
        <div className="text-4xl ml-1 nh">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="

          stroke-stone-100 size-14 p-1 mb-1 bg-sky-500/80 rounded-xl"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
            />
          </svg>
        </div>

        <div className="text-3xl ml-1 pt-2 nh">
          코딩의 정석부&nbsp;&nbsp;Pass
        </div>

        <div className="text-lg ml-1">
          QR코드를 스캔하여 체험 현황을
          <br />
          저장하고, 경품을 받아가세요.
        </div>
      </div>

      {/* 2. 체험 상태 표시 영역 */}
      <div className="rounded-3xl mt-3 p-5 text-lg bg-slate-100/90 shadow-2xl grid grid-cols-2 gap-2">
        <h3 className="col-span-2 text-xl font-bold border-b pb-2 mb-1 text-black">
          &nbsp;&nbsp;체험 현황
        </h3>
        {experienceArray.map((exp) => (
          <React.Fragment key={exp.name}>
            <div className="text-center py-2 font-medium">{exp.name}</div>
            <div className={getStatusClasses(exp.completed)}>
              {getStatusText(exp.completed)}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* 3. 도전과제 달성 상태 표시 영역 */}
      <div className="rounded-3xl mt-3 p-5 text-lg shadow-2xl bbg-slate-100/90 grid grid-cols-3 gap-2">
        <h3 className="col-span-3 text-xl font-bold border-b pb-2 mb-1 text-black">
          &nbsp;&nbsp;도전과제 달성 현황
        </h3>
        {challengeArray.map((ch) => (
          <div key={ch.name} className="text-center py-2 font-medium">
            {ch.name.replace("challenge", "CH")}
          </div>
        ))}
        {challengeArray.map((ch) => (
          <div
            key={ch.name + "status"}
            className={getStatusClasses(ch.completed)}
          >
            {getChallengeText(ch.completed)}
          </div>
        ))}
      </div>

      {/* 4. QR 스캐너 통합: 스캔 결과를 핸들링하는 함수를 prop으로 전달 */}
      <Qrscan onScanResult={handleScanResult} />
    </div>
  );
}
