import React from "react";
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
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext"; // [추가]
import Navigation from "../layout/navigation";
const { width } = Dimensions.get("window");

export default function MyPage({ navigation, route }) {
  // 로그인 시 받아온 유저 이름 (없으면 기본값)
  const { user, logout } = useAuth(); // [추가] 유저 정보와 로그아웃 함수
  const displayName = user?.name || route?.params?.userName || "Guest";
  const handleLogout = () => {
    logout(); // 로그아웃 -> App.js가 감지하고 로그인 화면으로 전환됨
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 1. 상단 헤더 (제목 + 설정 + 장바구니) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="bag-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 2. 유저 프로필 영역 */}
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View>
              <Text style={styles.userNameText}>{displayName}</Text>
              <View style={styles.levelContainer}>
                <Text style={styles.levelText}>.....</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.profileBtn}>
              <Ionicons name="person-outline" size={16} color="#888" />
              <Text style={styles.profileBtnText}> 프로필</Text>
            </TouchableOpacity>
          </View>

          {/* 포인트/쿠폰 요약 그리드 */}
          <View style={styles.statsGrid}>
            <TouchableOpacity style={styles.statsItem}>
              <View style={styles.circleIcon}>
                <Text style={styles.statsValue}>P</Text>
              </View>
              <Text style={styles.statsLabel}>CJ ONE</Text>
              <Text style={styles.statsCount}>454P</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statsItem}>
              <MaterialCommunityIcons
                name="ticket-percent-outline"
                size={24}
                color="#333"
                style={{ marginBottom: 4 }}
              />
              <Text style={styles.statsLabel}>쿠폰</Text>
              <Text style={styles.statsCount}>1</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statsItem}>
              <Ionicons
                name="card-outline"
                size={24}
                color="#333"
                style={{ marginBottom: 4 }}
              />
              <Text style={styles.statsLabel}>기프트{"\n"}카드</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statsItem}>
              <MaterialCommunityIcons
                name="barcode-scan"
                size={24}
                color="#333"
                style={{ marginBottom: 4 }}
              />
              <Text style={styles.statsLabel}>멤버십{"\n"}바코드</Text>
            </TouchableOpacity>
          </View>

          {/* 리뷰 쓰기 버튼 */}
          <TouchableOpacity style={styles.reviewButton}>
            <Text style={styles.reviewText}>
              리뷰쓰기 <Text style={{ fontWeight: "bold" }}>0개</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* 3. 주문/배송 조회 */}
        <View style={styles.orderSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>주문/배송 조회</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>전체보기 ></Text>
            </TouchableOpacity>
          </View>

          <View style={styles.processContainer}>
            {["주문접수", "결제완료", "배송준비중", "배송중", "배송완료"].map(
              (step, index) => (
                <View key={index} style={styles.processItem}>
                  <Text style={styles.processCount}>0</Text>
                  <Text style={styles.processLabel}>{step}</Text>
                  {/* 화살표 (마지막 아이템 제외) */}
                  {index < 4 && (
                    <View style={styles.arrowContainer}>
                      <Ionicons name="chevron-forward" size={12} color="#ddd" />
                    </View>
                  )}
                </View>
              )
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* 4. 배너 광고 영역 */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: "https://picsum.photos/600/150" }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>
              올리브영 현대카드 최대 5% 혜택
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 5. 쇼핑 활동 메뉴 리스트 */}
        <View style={styles.menuListContainer}>
          <Text
            style={[
              styles.sectionTitle,
              { marginBottom: 15, paddingHorizontal: 16 },
            ]}
          >
            쇼핑 활동
          </Text>

          <MenuRow icon="refresh-ccw" text="취소/반품/교환 내역" />
          <MenuRow icon="gift" text="선물함" />
          <MenuRow icon="truck" text="배송지 관리" />
          <MenuRow icon="bell" text="재입고 알림" />
        </View>
      </ScrollView>

      {/* 6. 하단 네비게이션 바 (활성화 상태: 마이) */}
      {/* <Navigation navigation={navigation} activeTab="mypage" /> */}
    </SafeAreaView>
  );
}

// 메뉴 한 줄 컴포넌트
const MenuRow = ({ icon, text }) => (
  <TouchableOpacity style={styles.menuRow}>
    <Feather name={icon} size={20} color="#333" style={{ marginRight: 10 }} />
    <Text style={styles.menuRowText}>{text}</Text>
  </TouchableOpacity>
);

// 하단 네비 버튼 컴포넌트
const NavButton = ({ nav, name, icon, label, isFeather, isMaterial }) => (
  <TouchableOpacity style={styles.navItem} onPress={() => nav.navigate(name)}>
    {isFeather ? (
      <Feather name={icon} size={24} color="#999" />
    ) : isMaterial ? (
      <MaterialCommunityIcons name={icon} size={24} color="#999" />
    ) : (
      <Ionicons name={icon} size={24} color="#999" />
    )}
    <Text style={styles.navText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /* 헤더 */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },

  /* 프로필 영역 */
  profileContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelText: {
    color: "#9FCA2E", // 올리브영 베이비 올리브 색상
    fontWeight: "bold",
    fontSize: 14,
  },
  profileBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  profileBtnText: {
    fontSize: 12,
    color: "#555",
  },

  /* 통계 그리드 */
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statsItem: {
    alignItems: "center",
    flex: 1,
  },
  circleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  statsLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  statsCount: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
  },

  reviewButton: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  reviewText: {
    color: "#333",
    fontSize: 14,
  },

  /* 구분선 */
  divider: {
    height: 10,
    backgroundColor: "#f5f5f5",
  },

  /* 주문/배송 조회 */
  orderSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  viewAllText: {
    fontSize: 13,
    color: "#888",
  },
  processContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  processItem: {
    alignItems: "center",
    width: width / 5.5,
  },
  processCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ddd", // '0'은 회색 처리
    marginBottom: 5,
  },
  processLabel: {
    fontSize: 11,
    color: "#888",
  },
  arrowContainer: {
    position: "absolute",
    right: -10,
    top: 20,
  },

  /* 배너 */
  bannerContainer: {
    height: 80,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  bannerOverlay: {
    padding: 15,
    backgroundColor: "rgba(230, 230, 230, 0.8)", // 배경색 흉내
    flex: 1,
    justifyContent: "center",
  },
  bannerText: {
    fontWeight: "bold",
    fontSize: 15,
  },

  /* 메뉴 리스트 */
  menuListContainer: {
    paddingVertical: 20,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  menuRowText: {
    fontSize: 15,
    color: "#333",
  },

  /* 하단 네비게이션 */
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
    paddingBottom: 20,
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
