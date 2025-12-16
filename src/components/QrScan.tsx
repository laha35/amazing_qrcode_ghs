// src/components/Qrscan.tsx
"use client";

import React, { useState } from "react";
import { useZxing } from "react-zxing";

interface QrscanProps {
  onScanResult: (result: string) => void;
}

const Qrscan: React.FC<QrscanProps> = ({ onScanResult }) => {
  const [startScan, setStartScan] = useState<boolean>(false);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<string>("");

  const { ref } = useZxing({
    onResult(result) {
      const scannedText = result.getText();
      setCurrentData(scannedText);

      // 스캔 성공 시 상위 컴포넌트로 결과 전달 및 스캐너 닫기
      onScanResult(scannedText);
      setStartScan(false);
      setIsCameraReady(false);
    },
    constraints: { video: { facingMode: "environment" } },
    paused: !startScan, // startScan 상태에 따라 스캐너 작동/중지
  });

  const handleScanToggle = () => {
    // 닫기 버튼을 누를 때는 데이터와 레디 상태를 초기화
    if (startScan) {
      setIsCameraReady(false);
      setCurrentData("");
    }
    setStartScan(!startScan);
  };

  const handleVideoLoaded = () => {
    setIsCameraReady(true);
  };

  return (
    <div className="">
      {/* QR 스캔 버튼 (항상 화면 하단에 위치) */}
      <div className="text-center px-5 fixed inset-x-0 bottom-5 z-20">
        <button
          className="flex items-center justify-center rounded-3xl text-2xl h-14 text-white w-full bg-sky-500 hover:bg-blue-600 shadow-xl transition-all duration-200"
          onClick={handleScanToggle}
        >
          {/* SVG 아이콘은 가독성을 위해 생략합니다. */}
          {startScan ? "닫기" : "QR 코드 스캔하기"}
        </button>
      </div>

      {/* QR 스캔 오버레이 (startScan이 true일 때만 표시) */}
      {startScan && (
        <div className="w-full  p-5 fixed inset-0 bg-slate-50/50 backdrop-blur-sm flex flex-col items-center pt-10 z-10">
          <div className="w-full mt-25 p-5 max-w-sm bg-slate-300/90 rounded-3xl h-80 overflow-hidden relative shadow-2xl">
            {/* 비디오 태그: onLoadedData 이벤트로 로딩 추적 */}
            <video
              ref={ref}
              className={`h-full justify-self-center aspect-square object-cover rounded-2xl transition-opacity duration-500 ${
                isCameraReady ? "opacity-100" : "opacity-0"
              }`}
              onLoadedData={handleVideoLoaded}
              style={{ objectFit: "cover" }}
              // 오디오를 비활성화하여 (muted) 권한 요청 시 사용자에게 부담을 줄임
              muted
              playsInline
            />

            {/* 로딩 인디케이터 (카메라 준비 중일 때만 표시) */}
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-300/90 text-white flex-col">
                <svg
                  className="animate-spin h-8 w-8 text-black"
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
                <p className="mt-3 text-sm font-semibold text-center text-black ">
                  카메라를 키고 있어요.
                  <br />
                  카메라 권한을 허용해주세요.
                </p>
              </div>
            )}

            {/* 스캔 영역 가이드 라인 (카메라 준비 시) */}
            {isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/5 aspect-square border-4 border-dashed border-sky-400 rounded-lg opacity-80 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Qrscan;
