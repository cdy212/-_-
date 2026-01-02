import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  StatusBar,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

// [추가] 분리한 네비게이션 컴포넌트 임포트
import Header from "../layout/header"; // 경로에 맞게 수정하세요
import Navigation from "../layout/navigation";
const { width } = Dimensions.get("window");

// 더미 데이터 (실제 앱에서는 서버에서 받아올 데이터)
const TOP_MENU = ["홈"]; // "홈", "오특", "랭킹", "세일", "기획전", "이벤트", "멤버십"
const CATEGORIES = [
  { id: 1, name: "메이크업", icon: "brush" },
  { id: 2, name: "스킨케어", icon: "water-outline" },
  { id: 3, name: "마스크팩", icon: "happy-outline" },
  { id: 4, name: "클렌징", icon: "sparkles-outline" },
  { id: 5, name: "바디케어", icon: "body-outline" },
  { id: 6, name: "헤어케어", icon: "cut-outline" },
  { id: 7, name: "어워즈", icon: "trophy-outline", color: "#d9f99d" }, // 포인트 컬러 예시
  { id: 8, name: "럭스에딧", icon: "diamond-outline" },
  { id: 9, name: "선물하기", icon: "gift-outline" },
  { id: 10, name: "라이브", icon: "videocam-outline", color: "#fecaca" },
];

const PRODUCTS = [
  {
    id: 1,
    title: "수분 진정 토너 200ml",
    brand: "라운드랩",
    price: "18,900",
    discount: "30%",
    img: "https://picsum.photos/200/200?random=1",
  },
  {
    id: 2,
    title: "비타민 잡티 세럼",
    brand: "구달",
    price: "24,000",
    discount: "20%",
    img: "https://picsum.photos/200/200?random=2",
  },
  {
    id: 3,
    title: "고보습 수분 크림",
    brand: "닥터지",
    price: "32,000",
    discount: "15%",
    img: "https://picsum.photos/200/200?random=3",
  },
];

export default function HomeIndex({ navigation, route }) {
  // 로그인한 유저 이름 (없으면 기본값)
  const userName = route?.params?.userName || "이*민";
  // 버튼 클릭 시 동작 (필요하면 구현)
  const handleSearch = () => console.log("검색 클릭");
  const handleCart = () => console.log("장바구니 클릭");

  // 상단 메뉴 렌더링
  const renderTopMenu = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.topMenuScroll}
    >
      {TOP_MENU.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.topMenuItem, index === 0 && styles.activeTopMenuItem]}
        >
          <Text
            style={[
              styles.topMenuText,
              index === 0 && styles.activeTopMenuText,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 1. 헤더 영역 */}
      <Header
        title="대만한인회"
        onSearchPress={handleSearch}
        onCartPress={handleCart}
      />

      {/* 2. 상단 탭 메뉴 */}
      <View style={styles.topMenuContainer}>{renderTopMenu()}</View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 3. 메인 배너 */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: "https://picsum.photos/800/600?random=10" }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>
              윈터퀘스트 미션 참여에{"\n"}포인트오브뷰 굿즈까지
            </Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>미션 참여하러 가기</Text>
            </TouchableOpacity>
            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>02 | 13 +</Text>
            </View>
          </View>
        </View>

        {/* 4. 카테고리 아이콘 그리드 (5개씩 2줄) */}
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem}>
              <View
                style={[
                  styles.iconCircle,
                  cat.color && { backgroundColor: cat.color },
                ]}
              >
                {/* 실제 이미지가 없어서 아이콘으로 대체 */}
                <Ionicons name={cat.icon} size={24} color="#333" />
              </View>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 5. 개인화 추천 섹션 */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Text style={{ color: "#1e4f98" }}>{userName}</Text>님을 위한
              인기상품
            </Text>
            <Text style={styles.adBadge}>AD ⓘ</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productScroll}
          >
            {PRODUCTS.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <Image
                  source={{ uri: product.img }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.brandName}>{product.brand}</Text>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.title}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.discountText}>{product.discount}</Text>
                    <Text style={styles.priceText}>{product.price}원</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 하단 여백용 더미 뷰 */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 6. 하단 네비게이션 바 (가짜 UI - 실제로는 TabNavigator 사용 권장) */}
      {/* <Navigation navigation={navigation} activeTab="home" /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /* 헤더 스타일 */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "900", // 아주 굵게
    fontStyle: "italic", // 약간 기울임
    marginRight: 4,
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconBtn: {
    marginLeft: 16,
  },

  /* 상단 탭 메뉴 */
  topMenuContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  topMenuScroll: {
    paddingLeft: 16,
  },
  topMenuItem: {
    paddingVertical: 12,
    marginRight: 20,
  },
  activeTopMenuItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  topMenuText: {
    fontSize: 15,
    color: "#888",
  },
  activeTopMenuText: {
    color: "#000",
    fontWeight: "bold",
  },

  /* 메인 배너 */
  bannerContainer: {
    width: width,
    height: width * 0.8, // 정사각형보다 약간 짧게
    position: "relative",
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.1)", // 약간 어둡게 해서 글씨 잘 보이게
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bannerBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    marginBottom: 20,
  },
  bannerBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pageIndicator: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pageText: {
    color: "#fff",
    fontSize: 12,
  },

  /* 카테고리 그리드 */
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  categoryItem: {
    width: (width - 20) / 5, // 5열 배치
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16, // 약간 둥근 사각형
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 12,
    color: "#333",
  },

  /* 인기 상품 섹션 */
  sectionContainer: {
    paddingLeft: 16,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  adBadge: {
    fontSize: 10,
    color: "#ccc",
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  productScroll: {
    paddingRight: 16,
  },
  productCard: {
    width: 140,
    marginRight: 12,
  },
  productImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  productInfo: {
    paddingHorizontal: 2,
  },
  brandName: {
    fontSize: 11,
    color: "#888",
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
    height: 36, // 2줄 높이 고정
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e02020", // 할인 컬러
    marginRight: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },

  /* 하단 네비게이션 바 (스타일만 구현) */
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 20, // 아이폰 노치 대응
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    color: "#999",
  },
});
