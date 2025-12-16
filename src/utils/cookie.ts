// src/utils/cookie.ts
import Cookies from "js-cookie";

const EXP_KEY = "qr_exp_status";
const CHALLENGE_KEY = "qr_challenge_status";

export interface ItemStatus {
  completed: boolean;
  name: string;
}

export interface StatusMap {
  [key: string]: ItemStatus;
}

// 기본 상태 정의
const initialExperiences: StatusMap = {
  web: { completed: false, name: "웹" },
  command: { completed: false, name: "커맨드" },
  game: { completed: false, name: "게임" },
};

const initialChallenges: StatusMap = {
  challenge1: { completed: false, name: "도전과제 1" },
  challenge2: { completed: false, name: "도전과제 2" },
  challenge3: { completed: false, name: "도전과제 3" },
};

/**
 * 쿠키에서 체험 상태를 로드합니다.
 */
export const loadExperiences = (): StatusMap => {
  const cookieData = Cookies.get(EXP_KEY);
  if (cookieData) {
    try {
      const savedData = JSON.parse(cookieData) as StatusMap;
      // 쿠키에 없는 항목은 기본값으로 채워 넣기 (스키마 변경 대비)
      return { ...initialExperiences, ...savedData };
    } catch (e) {
      console.error("Failed to parse experience cookie:", e);
    }
  }
  return initialExperiences;
};

/**
 * 체험 상태를 쿠키에 저장합니다.
 */
export const saveExperiences = (status: StatusMap) => {
  Cookies.set(EXP_KEY, JSON.stringify(status), { expires: 365 }); // 1년 유지
};

/**
 * 쿠키에서 도전과제 상태를 로드합니다.
 */
export const loadChallenges = (): StatusMap => {
  const cookieData = Cookies.get(CHALLENGE_KEY);
  if (cookieData) {
    try {
      const savedData = JSON.parse(cookieData) as StatusMap;
      return { ...initialChallenges, ...savedData };
    } catch (e) {
      console.error("Failed to parse challenge cookie:", e);
    }
  }
  return initialChallenges;
};

/**
 * 도전과제 상태를 쿠키에 저장합니다.
 */
export const saveChallenges = (status: StatusMap) => {
  Cookies.set(CHALLENGE_KEY, JSON.stringify(status), { expires: 365 }); // 1년 유지
};
