import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

// [1] 네비게이션 및 스크롤 훅 임포트
import Navigation from "../layout/navigation";
import useTabScroll from "../../src/hooks/useTabScroll";

const { width } = Dimensions.get("window");

export default function Store({ navigation }) {
  // [2] 스크롤 감지 훅 연결
  const { onScroll, isNavVisible } = useTabScroll();

  // 아이콘 메뉴 데이터
  const menuItems = [
    {
      title: "매장찾기",
      icon: "map-marker-outline",
      lib: "MaterialCommunityIcons",
    },
    {
      title: "매장재고",
      icon: "package-variant-closed",
      lib: "MaterialCommunityIcons",
    },
    {
      title: "쿠폰/증정",
      icon: "ticket-percent-outline",
      lib: "MaterialCommunityIcons",
    },
    {
      title: "스킨스캔",
      icon: "face-recognition",
      lib: "MaterialCommunityIcons",
    },
    { title: "올영명소", icon: "star-outline", lib: "MaterialCommunityIcons" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>올영매장</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="bag-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 상단 배너 (스킨스캔) */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>
                스킨스캔이 새로 오픈했어요!
              </Text>
              <View style={styles.bannerLink}>
                <Text style={styles.bannerLinkText}>스킨스캔 구경가기</Text>
                <Feather name="chevron-right" size={14} color="#666" />
              </View>
            </View>
            <View style={styles.closeBtn}>
              <Ionicons name="close" size={16} color="#bbb" />
            </View>
          </View>
        </View>

        {/* 아이콘 메뉴 */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.iconCircle}>
                {/* 아이콘은 라이브러리 상황에 맞춰 조정 (여기선 Ionicons 통일 예시) */}
                <Ionicons
                  name={
                    index === 0
                      ? "location-outline"
                      : index === 1
                      ? "cube-outline"
                      : "gift-outline"
                  }
                  size={24}
                  color={index === 3 ? "#FF6F61" : "#81C784"} // 예시 색상
                />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 이달의 스토어 콘텐츠 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>이달의 스토어 콘텐츠</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {/* 카드 1 */}
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardImagePlaceholder}>
                {/* 이미지 대신 배경색 처리 (실제 이미지 <Image source={...} /> 로 교체) */}
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}
                >
                  WINTER VILLAGE
                </Text>
              </View>
              <View style={styles.cardOverlay}>
                <Text style={styles.cardOverlayText}>
                  올리브영을 찾아온{"\n"}팝마트 친구들!
                </Text>
              </View>
            </TouchableOpacity>

            {/* 카드 2 */}
            <TouchableOpacity style={styles.card}>
              <View
                style={[
                  styles.cardImagePlaceholder,
                  { backgroundColor: "#E0E0E0" },
                ]}
              >
                <Text style={{ color: "#333" }}>피부 진단 솔루션</Text>
              </View>
              <View style={styles.cardOverlay}>
                <Text style={styles.cardOverlayText}>
                  피부 진단 솔루션을{"\n"}담은 스킨스캔 오픈
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 관심매장 소식 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>관심매장 소식</Text>
          <View style={styles.emptyBox}>{/* 빈 공간 예시 */}</View>
        </View>
      </ScrollView>

      {/* [4] 하단 네비게이션 추가 */}
      {/* <Navigation
        navigation={navigation}
        activeTab="store"
        visible={isNavVisible}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerIcons: { flexDirection: "row" },
  iconBtn: { marginLeft: 15 },

  scrollContainer: { paddingBottom: 20 },

  bannerContainer: { paddingHorizontal: 16, marginTop: 10 },
  bannerContent: {
    flexDirection: "row",
    backgroundColor: "#F5F7FA",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  bannerLink: { flexDirection: "row", alignItems: "center" },
  bannerLinkText: { fontSize: 13, color: "#666" },

  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 30,
  },
  menuItem: { alignItems: "center", width: width / 5.5 },
  iconCircle: {
    width: 48,
    height: 48,
    backgroundColor: "#f9f9f9",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  menuText: { fontSize: 12, color: "#333" },

  sectionContainer: { marginTop: 10, paddingLeft: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },

  horizontalScroll: { paddingRight: 16 },
  card: {
    width: width * 0.7,
    height: 320,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  cardImagePlaceholder: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
  },
  cardOverlay: { position: "absolute", bottom: 20, left: 15 },
  cardOverlayText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
  },

  emptyBox: {
    height: 200,
    backgroundColor: "#f9f9f9",
    marginRight: 16,
    borderRadius: 8,
  },
});
