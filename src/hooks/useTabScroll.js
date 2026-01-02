import { useState, useRef } from "react";

export default function useTabScroll() {
  // [중요] 네비게이션 표시 여부 상태 (초기값 true)
  const [isNavVisible, setIsNavVisible] = useState(true);
  const offset = useRef(0);

  const onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - offset.current;

    // 스크롤을 위로 올리거나(diff < 0), 맨 위일 때 -> 보이기
    if (currentOffset <= 0 || diff < -10) {
      if (!isNavVisible) setIsNavVisible(true);
    }
    // 스크롤을 아래로 내릴 때 -> 숨기기
    else if (diff > 10 && currentOffset > 0) {
      if (isNavVisible) setIsNavVisible(false);
    }

    offset.current = currentOffset;
  };

  // [중요] 여기서 isNavVisible을 꼭 반환해야 함!
  return { onScroll, isNavVisible };
}
