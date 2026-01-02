import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  useWindowDimensions,
  Image, // 이미지를 보여주기 위해 사용
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { parse } from "node-html-parser";
import "fast-text-encoding";
import { WebView } from "react-native-webview";

export default function CommunityScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const { height: windowHeight } = useWindowDimensions();
  const BASE_URL = "http://homepy.korean.net";

  const MENUS = {
    INTRO: {
      label: "한인회",
      items: [
        { label: "인사말", url: "/~tw/www/introduction/info.htm" },
        { label: "한인사회소개", url: "/~tw/www/introduction/summary.htm" },
        { label: "연혁", url: "/~tw/www/introduction/history.htm" },
        { label: "조직 및 임원구성", url: "/~tw/www/introduction/tree.htm" },
        { label: "한인회정관", url: "/~tw/www/introduction/jungguan.htm" },
        { label: "비전", url: "/~tw/www/introduction/company.htm" },
        { label: "재정 현황", url: "/~tw/www/introduction/money/list.htm" },
        {
          label: "찾아오시는 길",
          url: "/~tw/www/introduction/map01/index.htm",
        },
      ],
    },
    NEWS: {
      label: "한인회소식",
      items: [
        { label: "공지사항", url: "/~tw/www/news/groupnotice/list.htm" },
        { label: "보도자료", url: "/~tw/www/news/press/list.htm" },
        { label: "국내외 소식", url: "/~tw/www/news/news/list.htm" },
        { label: "코리안넷소식", url: "/~tw/www/news/notice/list.htm" },
      ],
    },
    GALLERY: {
      label: "갤러리",
      items: [
        // ★ [수정] 포토갤러리 URL 변경 (text.htm)
        {
          label: "포토갤러리",
          url: "/~tw/www/gallery/photo/text.htm?code=AS1291269561",
        },
        { label: "영상갤러리", url: "/~tw/www/gallery/movie/list.htm" },
      ],
    },
    COMMUNITY: {
      label: "커뮤니티",
      items: [
        { label: "자유게시판", url: "/~tw/www/community/board/list.htm" },
        { label: "홍보마당", url: "/~tw/www/community/public/list.htm" },
        { label: "벼룩시장", url: "/~tw/www/community/fleamarket/list.htm" },
        { label: "상담게시판", url: "/~tw/www/community/contact/list.htm" },
      ],
    },
    DATA: {
      label: "자료실",
      items: [
        { label: "자료실", url: "/~tw/www/data/data/list.htm" },
        { label: "한인회보", url: "/~tw/www/data/paper/list.htm" },
      ],
    },
  };

  const [currentMainKey, setCurrentMainKey] = useState("NEWS");
  const [currentSubIndex, setCurrentSubIndex] = useState(0);

  const handleMainTabChange = (key) => {
    setCurrentMainKey(key);
    setCurrentSubIndex(0);
  };

  useEffect(() => {
    const currentMenuObj = MENUS[currentMainKey];
    if (currentMenuObj && currentMenuObj.items[currentSubIndex]) {
      const targetUrl = currentMenuObj.items[currentSubIndex].url;
      crawlData(targetUrl);
    }
  }, [currentMainKey, currentSubIndex]);

  const crawlData = async (url) => {
    setLoading(true);
    setPosts([]);
    try {
      let fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
      let targetUrl = fullUrl;

      // if (Platform.OS === "web") {
      targetUrl = `https://corsproxy.io/?${encodeURIComponent(fullUrl)}`;
      // }

      console.log(`요청 시작: ${targetUrl}`);

      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
      };

      const response = await fetch(targetUrl, { headers });
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder("utf-8");
      const html = decoder.decode(buffer);

      const root = parse(html);
      let items = [];

      // ============================================================
      // 파싱 로직 분기
      // ============================================================

      // 1. 일반 리스트 (tr.print_list)
      const listRows = root.querySelectorAll("tr.print_list");

      // 2. ★ [추가] 포토갤러리 (table.tbTxtGallery)
      const galleryRows = root.querySelectorAll("table.tbTxtGallery tr");

      if (listRows.length > 0) {
        // [일반 게시판]
        listRows.forEach((row, index) => {
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
                type: "LIST",
                id: `${currentMainKey}_${index}`,
                title,
                link,
                author,
                date,
                views,
              });
            }
          } catch (err) {}
        });
      } else if (galleryRows.length > 0) {
        // ★ [포토 갤러리 파싱]
        console.log("포토 갤러리 구조 감지됨");
        galleryRows.forEach((row, index) => {
          try {
            const tds = row.querySelectorAll("td");
            // 헤더(th)인 경우 td가 없으므로 패스
            if (tds.length === 0) return;

            // td[2]: 이미지 (a > img)
            const imgTag = tds[2].querySelector("img");
            let imgSrc = imgTag ? imgTag.getAttribute("src") : null;
            if (imgSrc && !imgSrc.startsWith("http")) {
              imgSrc = `${BASE_URL}${imgSrc}`;
            }

            // td[3]: 제목 (a)
            const titleTag = tds[3].querySelector("a");
            const title = titleTag ? titleTag.textContent.trim() : "";
            const link = titleTag ? titleTag.getAttribute("href") : "";

            // td[4]: 글쓴이, td[5]: 날짜, td[6]: 조회수
            const author = tds[4] ? tds[4].textContent.trim() : "";
            const date = tds[5] ? tds[5].textContent.trim() : "";
            const views = tds[6] ? tds[6].textContent.trim() : "0";

            if (title && link) {
              items.push({
                type: "LIST", // 렌더링은 리스트 형태 공유 (이미지 있으면 보여줌)
                id: `${currentMainKey}_${index}`,
                title,
                link,
                author,
                date,
                views,
                image: imgSrc, // 이미지 필드 추가
              });
            }
          } catch (err) {}
        });
      } else {
        // 3. 리스트가 없으면 -> 정적 페이지(지도/정관) 또는 앨범형 게시판 체크
        const contentsDiv = root.querySelector("div.contents");
        if (contentsDiv) {
          console.log("정적 콘텐츠/지도 감지됨");

          let rawHtml = contentsDiv.innerHTML;
          rawHtml = rawHtml.replace(/src="\//g, `src="${BASE_URL}/`);
          rawHtml = rawHtml.replace(/href="\//g, `href="${BASE_URL}/`);
          rawHtml = rawHtml.replace(/url\('\//g, `url('${BASE_URL}/`);
          rawHtml = rawHtml.replace(/src="\.\.\//g, `src="${BASE_URL}/`);

          // 지도 높이 강제 조정
          rawHtml = rawHtml.replace(/height:\s*[0-9]+px/gi, "height:100vh");
          rawHtml = rawHtml.replace(/width:\s*[0-9]+px/gi, "width:100%");

          items.push({
            type: "HTML_CONTENT",
            id: "static_html",
            htmlContent: rawHtml,
            title: MENUS[currentMainKey].items[currentSubIndex].label,
          });
        } else {
          // 4. 앨범형(자유게시판 등)
          const galleryTables = root.querySelectorAll(
            'table[style*="word-break:break-all"]'
          );
          if (galleryTables.length > 0) {
            console.log("앨범형 게시판 감지됨");
            galleryTables.forEach((tbl, index) => {
              try {
                let titleLinkTag = null;
                const allLinks = tbl.querySelectorAll("a");
                allLinks.forEach((a) => {
                  if (a.textContent.trim().length > 0) titleLinkTag = a;
                });

                const title = titleLinkTag
                  ? titleLinkTag.textContent.trim()
                  : "제목 없음";
                const link = titleLinkTag
                  ? titleLinkTag.getAttribute("href")
                  : "";

                const rows = tbl.querySelectorAll("tr");
                let date = "";
                let views = "0";
                if (rows.length >= 3) {
                  const infoText = rows[rows.length - 1].textContent.trim();
                  const parts = infoText.split("|");
                  if (parts.length > 0) date = parts[0].trim();
                  if (parts.length > 1)
                    views = parts[1].replace("조회수", "").trim();
                }

                if (title && link) {
                  items.push({
                    type: "LIST",
                    id: `${currentMainKey}_${index}`,
                    title,
                    link,
                    author: "게시판",
                    date,
                    views,
                  });
                }
              } catch (err) {}
            });
          }
        }
      }

      console.log(`로드 성공: ${items.length}개`);
      setPosts(items);
    } catch (error) {
      console.error("Crawl Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePressItem = (link) => {
    if (!link) return;
    let fullLink = link;

    if (link.startsWith("/")) {
      fullLink = `${BASE_URL}${link}`;
    } else if (!link.startsWith("http")) {
      const currentUrl = MENUS[currentMainKey].items[currentSubIndex].url;
      // 쿼리스트링(?code=...)이 있는 경우 제거하고 경로 계산
      const cleanCurrentUrl = currentUrl.split("?")[0];
      const basePath = cleanCurrentUrl.substring(
        0,
        cleanCurrentUrl.lastIndexOf("/")
      );
      fullLink = `${BASE_URL}${basePath}/${link}`;
    }
    Linking.openURL(fullLink);
  };

  const goHome = () => {
    if (navigation) navigation.navigate("Home");
  };

  const currentSubMenus = MENUS[currentMainKey].items;

  // 렌더링 함수
  const renderItem = ({ item }) => {
    // 1. HTML 내용 보여주기
    if (item.type === "HTML_CONTENT") {
      const viewHeight = windowHeight - 170;
      const htmlSource = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
              body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow-x: hidden; font-family: 'Malgun Gothic', sans-serif; }
              img { max-width: 100%; height: auto; }
              .contents { padding: 10px; box-sizing: border-box; }
              #MapFrame { height: 100vh !important; width: 100% !important; }
            </style>
          </head>
          <body>
            ${item.htmlContent}
          </body>
          </html>
        `;

      return (
        <View style={[styles.htmlContainer, { height: viewHeight }]}>
          {Platform.OS === "web" ? (
            <iframe
              srcDoc={htmlSource}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="html-content"
            />
          ) : (
            <WebView
              originWhitelist={["*"]}
              source={{ html: htmlSource, baseUrl: BASE_URL }}
              style={{ flex: 1 }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={true}
              scrollEnabled={true}
            />
          )}
        </View>
      );
    }

    // 2. 일반 리스트 (포토갤러리 포함)
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handlePressItem(item.link)}
      >
        <View style={{ flexDirection: "row" }}>
          {/* ★ 이미지가 있으면 왼쪽에 표시 */}
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.itemImage} />
          )}

          <View style={{ flex: 1 }}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
            <View style={styles.itemFooter}>
              <Text style={styles.itemInfo}>
                {item.author} {item.date ? `· ${item.date}` : ""}
              </Text>
              <Text style={styles.itemViews}>
                {item.views ? `조회 ${item.views}` : ""}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.homeButton} onPress={goHome}>
          <Text style={styles.homeButtonText}>🏠 홈</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>중화민국 한인회</Text>
      </View>

      <View style={styles.mainMenuContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.keys(MENUS).map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.mainMenuButton,
                currentMainKey === key && styles.activeMainMenu,
              ]}
              onPress={() => handleMainTabChange(key)}
            >
              <Text
                style={[
                  styles.mainMenuText,
                  currentMainKey === key && styles.activeMainMenuText,
                ]}
              >
                {MENUS[key].label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.subMenuContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subMenuScroll}
        >
          {currentSubMenus.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.subMenuButton,
                currentSubIndex === index && styles.activeSubTab,
              ]}
              onPress={() => setCurrentSubIndex(index)}
            >
              <Text
                style={[
                  styles.subMenuText,
                  currentSubIndex === index && styles.activeSubTabText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
          contentContainerStyle={[
            styles.listContent,
            posts.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>게시글 목록이 없습니다.</Text>
              <TouchableOpacity
                style={styles.webLinkButton}
                onPress={() => {
                  const url = MENUS[currentMainKey].items[currentSubIndex].url;
                  Linking.openURL(BASE_URL + url);
                }}
              >
                <Text style={styles.webLinkText}>웹페이지에서 확인하기</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  homeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    marginRight: 10,
  },
  homeButtonText: { fontSize: 13, fontWeight: "bold", color: "#333" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1e4f98" },
  mainMenuContainer: { backgroundColor: "#1e4f98" },
  mainMenuButton: { paddingVertical: 12, paddingHorizontal: 16 },
  activeMainMenu: { borderBottomWidth: 3, borderBottomColor: "#fff" },
  mainMenuText: { fontSize: 15, color: "#aaccff", fontWeight: "600" },
  activeMainMenuText: { color: "#fff", fontWeight: "bold" },
  subMenuContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    height: 50,
  },
  subMenuScroll: { alignItems: "center", paddingHorizontal: 5 },
  subMenuButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 2,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeSubTab: { borderBottomColor: "#1e4f98" },
  subMenuText: { fontSize: 13, color: "#666" },
  activeSubTabText: { color: "#1e4f98", fontWeight: "bold" },

  htmlContainer: { width: "100%", backgroundColor: "#fff" },
  listContent: { padding: 15, flexGrow: 1 },

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
  // ★ 이미지 스타일 추가
  itemImage: {
    width: 80,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: "#eee",
  },
  itemHeader: { marginBottom: 8 },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 22,
  },
  itemFooter: { flexDirection: "row", justifyContent: "space-between" },
  itemInfo: { fontSize: 12, color: "#888" },
  itemViews: { fontSize: 12, color: "#aaa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#666" },
  emptyText: { color: "#999", fontSize: 15, marginBottom: 15 },
  webLinkButton: { padding: 10, backgroundColor: "#eee", borderRadius: 5 },
  webLinkText: { color: "#333", fontSize: 12 },
});
