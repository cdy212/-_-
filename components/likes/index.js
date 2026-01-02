import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navigation from "../layout/navigation"; // 네비게이션 컴포넌트 임포트

const { width } = Dimensions.get("window");

// 3열 그리드를 위한 카드 너비 계산 (여백 제외)
const cardWidth = (width - 40) / 3;

// 추천 상품 더미 데이터 (이미지의 상품들과 유사하게 구성)
const RECOMMENDED_PRODUCTS = [
  {
    id: 1,
    brand: "릴리바이레드",
    title: "[단독컬러] 릴리바이레드 러브빔 치크",
    originalPrice: "13,000",
    price: "9,800",
    discount: "24%",
    img: "https://picsum.photos/200/200?random=10",
  },
  {
    id: 2,
    brand: "퓌",
    title: "[글로스 미니 증정] 퓌 3D 볼류밍 글로스",
    originalPrice: "18,000",
    price: "13,500",
    discount: "25%",
    img: "https://picsum.photos/200/200?random=11",
  },
  {
    id: 3,
    brand: "페리페라",
    title: "페리페라 맑게 물든 선샤인 치크",
    originalPrice: "8,000",
    price: "6,400",
    discount: "20%",
    img: "https://picsum.photos/200/200?random=12",
  },
  {
    id: 4,
    brand: "메디힐",
    title: "[2025 어워즈] 마데카소사이드 흔적 패드",
    originalPrice: "",
    price: "19,900",
    discount: "",
    img: "https://picsum.photos/200/200?random=13",
  },
  {
    id: 5,
    brand: "롬앤",
    title: "[2025 어워즈] 롬앤 쥬시 래스팅 틴트",
    originalPrice: "13,000",
    price: "8,400",
    discount: "35%",
    img: "https://picsum.photos/200/200?random=14",
  },
  {
    id: 6,
    brand: "얼터너티브",
    title: "[NEW] 얼터너티브 스테레오 립 포션",
    originalPrice: "19,000",
    price: "15,200",
    discount: "20%",
    img: "https://picsum.photos/200/200?random=15",
  },
];

export default function Likes({ navigation }) {
  const [activeTab, setActiveTab] = useState("likes"); // 'recent' | 'likes'

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 1. 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>히스토리</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="bag-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. 상단 탭 (최근 본 / 좋아요한) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "recent" && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab("recent")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "recent" && styles.activeTabText,
            ]}
          >
            최근 본
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "likes" && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab("likes")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "likes" && styles.activeTabText,
            ]}
          >
            좋아요한
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 3. 빈 상태 메시지 (좋아요 탭일 때만 표시) */}
        {activeTab === "likes" && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>좋아요한 상품이 아직 없어요</Text>
          </View>
        )}

        {/* 4. 추천 상품 영역 */}
        <View style={styles.recommendSection}>
          <Text style={styles.sectionTitle}>이 상품은 어때요?</Text>

          <View style={styles.gridContainer}>
            {RECOMMENDED_PRODUCTS.map((item) => (
              <TouchableOpacity key={item.id} style={styles.gridItem}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: item.img }}
                    style={styles.productImage}
                  />
                  {/* 이미지 위 뱃지 등이 있다면 여기에 추가 */}
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {item.title}
                  </Text>

                  {item.originalPrice ? (
                    <Text style={styles.originalPrice}>
                      {item.originalPrice}원
                    </Text>
                  ) : null}

                  <View style={styles.priceRow}>
                    {item.discount ? (
                      <Text style={styles.discountText}>{item.discount}</Text>
                    ) : null}
                    <Text style={styles.priceText}>{item.price}원~</Text>
                  </View>
                </View>

                {/* 하트 아이콘 */}
                <TouchableOpacity style={styles.heartBtn}>
                  <Ionicons name="heart-outline" size={16} color="#ccc" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 5. 하단 네비게이션 (좋아요 탭 활성화) */}
      {/* <Navigation navigation={navigation} activeTab="likes" /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  /* 헤더 */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerIcons: { flexDirection: "row" },
  iconBtn: { marginLeft: 16 },

  /* 상단 탭 */
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabItem: {
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 15,
    color: "#888",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },

  /* 빈 상태 */
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
  },

  /* 추천 상품 섹션 */
  recommendSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: cardWidth,
    marginBottom: 24,
  },
  imageWrapper: {
    width: "100%",
    height: cardWidth, // 정사각형 이미지
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#f8f8f8",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productInfo: {
    paddingRight: 4,
  },
  productTitle: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
    marginBottom: 4,
    height: 36, // 2줄 높이 확보
  },
  originalPrice: {
    fontSize: 11,
    color: "#aaa",
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountText: {
    fontSize: 14,
    color: "#e02020",
    fontWeight: "bold",
    marginRight: 4,
  },
  priceText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  heartBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 4,
  },
});
