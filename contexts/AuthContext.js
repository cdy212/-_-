import React, { createContext, useState, useEffect, useContext } from "react";
import { storage, USER_SESSION_KEY } from "../utils/storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // 유저 정보 (null이면 비로그인)
  const [loading, setLoading] = useState(true); // 로딩 상태 (앱 켤 때 확인 중)

  // 앱 실행 시 저장된 로그인 정보 확인
  useEffect(() => {
    const loadSession = async () => {
      const savedUser = await storage.get(USER_SESSION_KEY);
      if (savedUser) {
        setUser(savedUser);
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  // 로그인 함수
  const login = async (userData) => {
    // 1. 상태 업데이트
    setUser(userData);
    // 2. 기기에 저장 (영구 유지)
    await storage.save(USER_SESSION_KEY, userData);
  };

  // 로그아웃 함수
  const logout = async () => {
    // 1. 상태 초기화
    setUser(null);
    // 2. 저장소 삭제
    await storage.remove(USER_SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 간편하게 쓰기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);
