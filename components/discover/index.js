import React, { useState } from "react";
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
import { Ionicons, Feather } from "@expo/vector-icons";

// [1] 네비게이션 및 스크롤 훅 임포트
import Navigation from "../layout/navigation";
import useTabScroll from "../../src/hooks/useTabScroll";

const { width } = Dimensions.get("window");

export default function Discover({ navigation }) {
  const [mainTab, setMainTab] = useState("셔터");
  const [subTab, setSubTab] = useState("추천");

  // [2] 스크롤 감지 훅 연결
  const { onScroll, isNavVisible } = useTabScroll();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>발견</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="bag-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 메인 탭 */}
      <View style={styles.mainTabContainer}>
        {["셔터", "매거진", "라이브"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.mainTabItem,
              mainTab === tab && styles.mainTabItemActive,
            ]}
            onPress={() => setMainTab(tab)}
          >
            <Text
              style={[
                styles.mainTabText,
                mainTab === tab && styles.mainTabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* [3] ScrollView에 onScroll 연결 */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        onScroll={onScroll} // 스크롤 이벤트 연결
        scrollEventThrottle={16} // 부드러운 감지
        showsVerticalScrollIndicator={false}
      >
        {/* 서브 탭 */}
        <View style={styles.subTabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["추천", "랭킹", "팔로잉"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={styles.subTabItem}
                onPress={() => setSubTab(tab)}
              >
                <Text
                  style={[
                    styles.subTabText,
                    subTab === tab && styles.subTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.myProfileLink}>
              <Ionicons name="person-circle-outline" size={16} color="#aaa" />
              <Text style={styles.myProfileText}>내 프로필</Text>
              <Feather name="chevron-right" size={14} color="#aaa" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.grayDivider} />
        <View style={styles.feedNotice}>
          <Text style={styles.feedNoticeText}>
            '내 또래가 많이 보는 상품' 관련
          </Text>
        </View>

        {/* 피드 게시물 */}
        <View style={styles.feedItem}>
          <View style={styles.userRow}>
            <View style={styles.userInfo}>
              <View style={styles.avatar} />
              <Text style={styles.userName}>혜영이0115</Text>
            </View>
            <View style={styles.userActions}>
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followBtnText}>팔로우</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.contentImageContainer}>
            <View style={styles.contentImage} />
            <View style={styles.soundIcon}>
              <Ionicons name="volume-mute" size={16} color="#fff" />
            </View>
          </View>

          <View style={styles.productOverlay}>
            <View style={styles.productThumb} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                [2025어워즈/오리지널 c-PDRN]...
              </Text>
            </View>
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 하단 여백 (네비게이션 바 가려짐 방지) */}
        <View style={{ height: 100 }} />
      </ScrollView>
      {/* 
      {/* [4] 하단 네비게이션 추가
      <Navigation
        navigation={navigation}
        activeTab="discover"
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

  mainTabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  mainTabItem: { marginRight: 20, paddingVertical: 12 },
  mainTabItemActive: { borderBottomWidth: 2, borderBottomColor: "#000" },
  mainTabText: { fontSize: 16, color: "#999", fontWeight: "bold" },
  mainTabTextActive: { color: "#000" },

  scrollContainer: { paddingBottom: 20 },

  subTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  subTabItem: { marginRight: 15 },
  subTabText: { fontSize: 14, color: "#888" },
  subTabTextActive: { color: "#000", fontWeight: "bold" },
  myProfileLink: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
  myProfileText: { fontSize: 12, color: "#666", marginLeft: 4 },

  grayDivider: { height: 1, backgroundColor: "#f2f2f2" },
  feedNotice: { padding: 12, backgroundColor: "#fff" },
  feedNoticeText: { fontSize: 13, fontWeight: "bold", color: "#333" },

  feedItem: { marginBottom: 30 },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ddd",
    marginRight: 8,
  },
  userName: { fontWeight: "bold", fontSize: 14 },
  userActions: { flexDirection: "row", alignItems: "center" },
  followBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  followBtnText: { fontSize: 12, fontWeight: "bold" },

  contentImageContainer: {
    width: width,
    height: width * 1.3,
    backgroundColor: "#333",
    position: "relative",
  },
  contentImage: { width: "100%", height: "100%", backgroundColor: "#555" },
  soundIcon: {
    position: "absolute",
    bottom: 20,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  productOverlay: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  productThumb: {
    width: 40,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginRight: 10,
  },
  productInfo: { flex: 1 },
  productName: { fontSize: 13, color: "#333" },

  addBtn: {
    position: "absolute",
    right: 16,
    bottom: 80,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
