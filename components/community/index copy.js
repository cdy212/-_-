import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { parse } from "node-html-parser";

// ★ [수정 1] 인코딩 라이브러리 변경 (폴리필)
import "fast-text-encoding";

export default function CommunityScreen() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentType, setCurrentType] = useState("NOTICE");

  const URLS = {
    NOTICE: "http://homepy.korean.net/~tw/www/news/groupnotice/list.htm",
    KOREA: "http://homepy.korean.net/~tw/www/news/news/list.htm",
    GROUP: "http://homepy.korean.net/~tw/www/news/notice/index.htm",
  };

  useEffect(() => {
    crawlData(URLS[currentType]);
  }, [currentType]);

  const crawlData = async (url) => {
    setLoading(true);
    setPosts([]);
    try {
      let targetUrl = url;

      // 웹 환경: CORS 우회 프록시 사용
      if (Platform.OS === "web") {
        targetUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      }

      console.log(`요청 시작: ${targetUrl}`);

      const headers =
        Platform.OS === "web"
          ? {}
          : {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
            };

      const response = await fetch(targetUrl, { headers });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      // 1. 바이너리 데이터 가져오기
      const buffer = await response.arrayBuffer();

      // ★ [수정 2] 'euc-kr' 대신 'windows-949' 사용 (더 넓은 범위의 한글 지원)
      // TextDecoder는 fast-text-encoding에 의해 전역으로 사용 가능
      const decoder = new TextDecoder("utf-8");
      const html = decoder.decode(buffer);

      // 2. 파싱 시작
      const root = parse(html);
      const items = [];
      const rows = root.querySelectorAll("tr.print_list");

      rows.forEach((row, index) => {
        try {
          const tds = row.querySelectorAll("td");
          const linkTag = row.querySelector("a");

          let title = linkTag ? linkTag.textContent.trim() : "";
          const link = linkTag ? linkTag.getAttribute("href") : "";

          const author = tds[5] ? tds[5].textContent.trim() : "관리자";
          const date = tds[6] ? tds[6].textContent.trim() : "";
          const views = tds[7] ? tds[7].textContent.trim() : "0";

          if (title && link) {
            items.push({
              id: `${currentType}_${index}_${Date.now()}`,
              title: title,
              link: link,
              author: author,
              date: date,
              views: views,
            });
          }
        } catch (err) {
          console.warn("Row Parsing Error:", err);
        }
      });

      console.log(`로드 성공: ${items.length}개`);
      setPosts(items);
    } catch (error) {
      console.error("Crawl Error:", error);
      if (Platform.OS === "web") {
        // 웹에서는 alert가 너무 자주 뜨면 불편하므로 콘솔에만 찍거나 조용히 처리
        console.log("데이터 로드 실패:", error.message);
      } else {
        Alert.alert("오류", "데이터를 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePressItem = (link) => {
    if (!link) return;
    let fullLink = link;
    if (link.startsWith("/")) {
      fullLink = `http://homepy.korean.net${link}`;
    } else if (!link.startsWith("http")) {
      fullLink = `http://homepy.korean.net/~tw/www/news/news/${link}`;
    }
    Linking.openURL(fullLink);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handlePressItem(item.link)}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
      <View style={styles.itemFooter}>
        <Text style={styles.itemInfo}>
          {item.author} · {item.date}
        </Text>
        <Text style={styles.itemViews}>조회 {item.views}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        {Object.keys(URLS).map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.tabButton, currentType === key && styles.activeTab]}
            onPress={() => setCurrentType(key)}
          >
            <Text
              style={[
                styles.tabText,
                currentType === key && styles.activeTabText,
              ]}
            >
              {key === "NOTICE"
                ? "공지사항"
                : key === "KOREA"
                ? "국내소식"
                : "한인회소식"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1e4f98" />
          <Text style={styles.loadingText}>데이터 불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>게시글이 없습니다.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: { borderBottomColor: "#1e4f98" },
  tabText: { fontSize: 14, color: "#888", fontWeight: "600" },
  activeTabText: { color: "#1e4f98", fontWeight: "bold" },
  listContent: { padding: 15 },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemHeader: { marginBottom: 8 },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 22,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: { fontSize: 12, color: "#888" },
  itemViews: { fontSize: 12, color: "#aaa" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: { marginTop: 10, color: "#666" },
  emptyText: { color: "#999", fontSize: 15 },
});
