import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput } from "react-native";
import ShoppingListModal from "../../components/ShoppingListModal";
import { Text, View } from "../../components/Themed";
import { useShopping } from "../../context/ShoppingContext";
import { ShoppingList } from "../../types/shopping";

const groceryCategories = [
  {
    id: 1,
    name: "Fresh Produce",
    icon: "leaf",
    items: 124,
    gradient: ["#4CAF50", "#8BC34A"],
  },
  {
    id: 2,
    name: "Dairy & Eggs",
    icon: "egg",
    items: 45,
    gradient: ["#2196F3", "#03A9F4"],
  },
  {
    id: 3,
    name: "Bakery",
    icon: "restaurant",
    items: 28,
    gradient: ["#FF9800", "#FFC107"],
  },
  {
    id: 4,
    name: "Meat & Fish",
    icon: "fish",
    items: 56,
    gradient: ["#F44336", "#E91E63"],
  },
  {
    id: 5,
    name: "Pantry",
    icon: "basket",
    items: 89,
    gradient: ["#9C27B0", "#673AB7"],
  },
  {
    id: 6,
    name: "Beverages",
    icon: "wine",
    items: 67,
    gradient: ["#00BCD4", "#009688"],
  },
];

const featuredDeals = [
  {
    id: 1,
    name: "Organic Bananas",
    originalPrice: 4.99,
    price: 2.99,
    discount: "40% OFF",
    emoji: "🍌",
  },
  {
    id: 2,
    name: "Whole Milk",
    originalPrice: 5.49,
    price: 3.99,
    discount: "27% OFF",
    emoji: "🥛",
  },
  {
    id: 3,
    name: "Sourdough Bread",
    originalPrice: 6.99,
    price: 4.99,
    discount: "29% OFF",
    emoji: "🍞",
  },
  {
    id: 4,
    name: "Chicken Breast",
    originalPrice: 12.99,
    price: 8.99,
    discount: "31% OFF",
    emoji: "🍗",
  },
];

const recentOrders = [
  {
    id: 1,
    name: "Weekly Groceries",
    date: "2 days ago",
    total: 67.89,
    status: "Delivered",
  },
  {
    id: 2,
    name: "Quick Essentials",
    date: "5 days ago",
    total: 23.45,
    status: "Delivered",
  },
];

export default function DashboardScreen() {
  const { state, dispatch } = useShopping();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">(
    "create",
  );
  const [selectedList, setSelectedList] = useState<ShoppingList | undefined>();

  const handleCreateList = () => {
    setModalMode("create");
    setSelectedList(undefined);
    setModalVisible(true);
  };

  const handleViewList = (list: ShoppingList) => {
    setModalMode("view");
    setSelectedList(list);
    setModalVisible(true);
  };

  const handleEditList = (list: ShoppingList) => {
    setModalMode("edit");
    setSelectedList(list);
    setModalVisible(true);
  };

  const getRecentLists = () => {
    if (!state.lists || state.lists.length === 0) return [];
    return state.lists
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 3);
  };

  const getListProgress = (list: ShoppingList) => {
    if (!list || !list.items || list.items.length === 0) return 0;
    const checkedItems = list.items.filter((item) => item.checked).length;
    return (checkedItems / list.items.length) * 100;
  };

  const getListTotal = (list: ShoppingList) => {
    if (!list || !list.items) return 0;
    return list.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.userName}>Sarah</Text>
          </View>
          <Pressable style={styles.profileButton}>
            <Ionicons name="person-circle" size={40} color="#4CAF50" />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products or lists..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Delivery Banner */}
      <View style={styles.deliveryBanner}>
        <View style={styles.deliveryInfo}>
          <Ionicons name="location" size={20} color="#4CAF50" />
          <View style={styles.deliveryText}>
            <Text style={styles.deliveryTitle}>Deliver to</Text>
            <Text style={styles.deliveryAddress}>123 Main St, Apt 4B</Text>
          </View>
        </View>
        <Pressable style={styles.changeButton}>
          <Text style={styles.changeButtonText}>Change</Text>
        </Pressable>
      </View>

      {/* Shopping Lists Widget */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>� Shopping Lists</Text>
          <Pressable onPress={handleCreateList}>
            <Text style={styles.seeAllText}>Create New</Text>
          </Pressable>
        </View>

        {state.lists.length === 0 ? (
          <View style={styles.emptyLists}>
            <Ionicons name="list-outline" size={48} color="#ccc" />
            <Text style={styles.emptyListsText}>No shopping lists yet</Text>
            <Text style={styles.emptyListsSubtext}>
              Create your first list to get started
            </Text>
            <Pressable
              style={styles.createFirstListButton}
              onPress={handleCreateList}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.createFirstListText}>Create List</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {getRecentLists().map((list) => {
              const progress = getListProgress(list);
              const total = getListTotal(list);
              const checkedItems = list.items.filter(
                (item) => item.checked,
              ).length;

              return (
                <Pressable
                  key={list.id}
                  style={styles.listCard}
                  onPress={() => handleViewList(list)}
                >
                  <View style={styles.listCardLeft}>
                    <View
                      style={[
                        styles.listColorIndicator,
                        { backgroundColor: list.color },
                      ]}
                    />
                    <View style={styles.listInfo}>
                      <Text style={styles.listName}>{list.name}</Text>
                      <Text style={styles.listStore}>🛒 {list.store}</Text>
                      <Text style={styles.listStats}>
                        {checkedItems}/{list.items.length} items • $
                        {total.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.listCardRight}>
                    <View style={styles.progressCircle}>
                      <Text style={styles.progressText}>
                        {Math.round(progress)}%
                      </Text>
                    </View>
                    <Pressable
                      style={styles.listMenuButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleEditList(list);
                      }}
                    >
                      <Ionicons
                        name="ellipsis-vertical"
                        size={20}
                        color="#999"
                      />
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}

            {state.lists.length > 3 && (
              <Pressable style={styles.viewAllListsButton}>
                <Text style={styles.viewAllListsText}>
                  View All Lists ({state.lists.length})
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
              </Pressable>
            )}
          </>
        )}
      </View>

      {/* Featured Deals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Hot Deals</Text>
          <Pressable>
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dealsScroll}
        >
          {featuredDeals.map((deal) => (
            <Pressable key={deal.id} style={styles.dealCard}>
              <View style={styles.dealImage}>
                <Text style={styles.dealEmoji}>{deal.emoji}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{deal.discount}</Text>
                </View>
              </View>
              <Text style={styles.dealName}>{deal.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>${deal.originalPrice}</Text>
                <Text style={styles.dealPrice}>${deal.price}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <View style={styles.categoriesGrid}>
          {groceryCategories.map((category) => (
            <Pressable key={category.id} style={styles.categoryCard}>
              <View
                style={[
                  styles.categoryIcon,
                  {
                    backgroundColor: category.gradient[0],
                    shadowColor: category.gradient[0],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  },
                ]}
              >
                <Ionicons name={category.icon as any} size={28} color="#fff" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryItems}>{category.items} items</Text>
              <View style={styles.categoryCardOverlay} />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <Pressable>
            <Text style={styles.seeAllText}>View all</Text>
          </Pressable>
        </View>
        {recentOrders.map((order) => (
          <Pressable key={order.id} style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderName}>{order.name}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
            <View style={styles.orderRight}>
              <Text style={styles.orderTotal}>${order.total}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <Pressable style={styles.quickActionCard} onPress={handleCreateList}>
            <Ionicons name="list" size={24} color="#4CAF50" />
            <Text style={styles.quickActionText}>New List</Text>
          </Pressable>
          <Pressable style={styles.quickActionCard}>
            <Ionicons name="repeat" size={24} color="#E91E63" />
            <Text style={styles.quickActionText}>Reorder</Text>
          </Pressable>
          <Pressable style={styles.quickActionCard}>
            <Ionicons name="heart" size={24} color="#E91E63" />
            <Text style={styles.quickActionText}>Favorites</Text>
          </Pressable>
          <Pressable style={styles.quickActionCard}>
            <Ionicons name="pricetag" size={24} color="#FF9800" />
            <Text style={styles.quickActionText}>Coupons</Text>
          </Pressable>
        </View>
      </View>

      {/* Shopping List Modal */}
      <ShoppingListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        list={selectedList}
        mode={modalMode}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  deliveryBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    marginLeft: 10,
  },
  deliveryTitle: {
    fontSize: 12,
    color: "#666",
  },
  deliveryAddress: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  seeAllText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  emptyLists: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyListsText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 5,
  },
  emptyListsSubtext: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
    textAlign: "center",
  },
  createFirstListButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstListText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  listCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  listCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  listColorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  listStore: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 2,
  },
  listStats: {
    fontSize: 12,
    color: "#666",
  },
  listCardRight: {
    alignItems: "center",
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  listMenuButton: {
    padding: 5,
  },
  viewAllListsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
  },
  viewAllListsText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
    marginRight: 5,
  },
  dealsScroll: {
    marginLeft: -5,
  },
  dealCard: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dealImage: {
    width: "100%",
    height: 80,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  dealEmoji: {
    fontSize: 40,
  },
  discountBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#FF4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  dealName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 6,
  },
  dealPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderRight: {
    alignItems: "flex-end",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "23%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 8,
    textAlign: "center",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    position: "relative",
    overflow: "hidden",
  },
  categoryCardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    pointerEvents: "none",
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 6,
    lineHeight: 20,
  },
  categoryItems: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
