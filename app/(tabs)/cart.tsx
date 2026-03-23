import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
} from "react-native";
import CartFilters from "../../components/CartFilters";
import ShoppingListModal from "../../components/ShoppingListModal";
import { Text, View } from "../../components/Themed";
import { useShopping } from "../../context/ShoppingContext";
import { ShoppingList } from "../../types/shopping";

export default function CartScreen() {
  const { state, dispatch } = useShopping();
  const [promoCode, setPromoCode] = useState("");
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<ShoppingList | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedStore: "all",
    selectedCategory: "all",
    showCheckedOnly: false,
    sortBy: "name" as "name" | "price" | "list",
    sortOrder: "asc" as "asc" | "desc",
  });

  const getAllCartItems = () => {
    const allItems: any[] = [];
    if (state && state.lists) {
      state.lists.forEach((list) => {
        if (list && list.items) {
          list.items.forEach((item) => {
            allItems.push({
              ...item,
              listId: list.id,
              listName: list.name,
              listColor: list.color,
            });
          });
        }
      });
    }
    return allItems;
  };

  const [items, setItems] = useState(() => getAllCartItems());

  // Update items when shopping state changes
  useEffect(() => {
    setItems(getAllCartItems());
  }, [state.lists]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = expressDelivery ? 9.99 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const updateQuantity = (listId: string, itemId: string, change: number) => {
    const currentItem = items.find((item) => item.id === itemId);
    if (!currentItem) return;

    const newQuantity = Math.max(1, currentItem.quantity + change);

    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        listId,
        itemId,
        updates: {
          quantity: newQuantity,
          subtotal: newQuantity * currentItem.price,
        },
      },
    });

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            subtotal: newQuantity * item.price,
          };
        }
        return item;
      }),
    );
  };

  const removeItem = (listId: string, itemId: string) => {
    dispatch({
      type: "DELETE_ITEM",
      payload: { listId, itemId },
    });

    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const toggleItemChecked = (listId: string, itemId: string) => {
    dispatch({
      type: "TOGGLE_ITEM_CHECKED",
      payload: { listId, itemId },
    });

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, checked: !item.checked };
        }
        return item;
      }),
    );
  };

  const handleViewList = (list: ShoppingList) => {
    setSelectedList(list);
    setModalVisible(true);
  };

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let itemsToFilter = [...items];

    // Apply search filter
    if (filters.searchQuery) {
      itemsToFilter = itemsToFilter.filter(
        (item) =>
          item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.notes?.toLowerCase().includes(filters.searchQuery.toLowerCase()),
      );
    }

    // Apply store filter
    if (filters.selectedStore !== "all") {
      itemsToFilter = itemsToFilter.filter(
        (item) => item.store === filters.selectedStore,
      );
    }

    // Apply category filter
    if (filters.selectedCategory !== "all") {
      itemsToFilter = itemsToFilter.filter(
        (item) => item.category === filters.selectedCategory,
      );
    }

    // Apply status filter
    if (filters.showCheckedOnly) {
      itemsToFilter = itemsToFilter.filter((item) => item.checked);
    }

    // Apply sorting
    itemsToFilter.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price * a.quantity - b.price * b.quantity;
          break;
        case "list":
          comparison = a.listName.localeCompare(b.listName);
          break;
      }

      return filters.sortOrder === "desc" ? -comparison : comparison;
    });

    return itemsToFilter;
  }, [items, filters]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.selectedStore !== "all") count++;
    if (filters.selectedCategory !== "all") count++;
    if (filters.showCheckedOnly) count++;
    return count;
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      selectedStore: "all",
      selectedCategory: "all",
      showCheckedOnly: false,
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  // Recalculate grouped items from filtered items
  const filteredGroupedItems = useMemo(() => {
    return filteredItems.reduce(
      (
        acc: Record<
          string,
          { listId: string; listColor: string; items: any[] }
        >,
        item: any,
      ) => {
        if (!acc[item.listName]) {
          acc[item.listName] = {
            listId: item.listId,
            listColor: item.listColor,
            items: [] as any[],
          };
        }
        acc[item.listName].items.push(item);
        return acc;
      },
      {} as Record<string, { listId: string; listColor: string; items: any[] }>,
    );
  }, [filteredItems]);

  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.listName]) {
        acc[item.listName] = {
          listId: item.listId,
          listColor: item.listColor,
          items: [] as any[],
        };
      }
      acc[item.listName].items.push(item);
      return acc;
    },
    {} as Record<string, { listId: string; listColor: string; items: any[] }>,
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Shopping Cart</Text>
          <Pressable style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>
          {items.length} items from {state.lists.length} lists
        </Text>
      </View>

      {/* Delivery Options */}
      <View style={styles.deliverySection}>
        <View style={styles.deliveryOption}>
          <View style={styles.deliveryInfo}>
            <Ionicons name="time" size={20} color="#4CAF50" />
            <View style={styles.deliveryText}>
              <Text style={styles.deliveryTitle}>Express Delivery</Text>
              <Text style={styles.deliverySubtitle}>Within 2 hours</Text>
            </View>
          </View>
          <View style={styles.deliveryRight}>
            <Text style={styles.deliveryPrice}>${deliveryFee.toFixed(2)}</Text>
            <Switch
              value={expressDelivery}
              onValueChange={setExpressDelivery}
              trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
              thumbColor={expressDelivery ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>
      </View>

      {/* Cart Items */}
      <View style={styles.cartItemsHeader}>
        <View style={styles.cartItemsTitleRow}>
          <Text style={styles.cartItemsTitle}>Items ({items.length})</Text>
          <View style={styles.cartItemsActions}>
            <Pressable
              style={styles.filterButton}
              onPress={() => setShowFilters(true)}
            >
              <Ionicons name="filter" size={16} color="#4CAF50" />
              <Text style={styles.filterButtonText}>
                Filters{" "}
                {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Text>
            </Pressable>
          </View>
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
            placeholder="Search items..."
            value={filters.searchQuery}
            onChangeText={(text) =>
              setFilters((prev) => ({ ...prev, searchQuery: text }))
            }
            placeholderTextColor="#999"
          />
          {filters.searchQuery && (
            <Pressable
              style={styles.clearSearchButton}
              onPress={() =>
                setFilters((prev) => ({ ...prev, searchQuery: "" }))
              }
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </Pressable>
          )}
        </View>

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <View style={styles.activeFiltersSummary}>
            <Text style={styles.activeFiltersText}>
              Showing {filteredItems.length} of {items.length} items
            </Text>
            <Pressable onPress={handleResetFilters}>
              <Text style={styles.clearFiltersText}>Clear all</Text>
            </Pressable>
          </View>
        )}
      </View>

      <ScrollView style={styles.cartItems} showsVerticalScrollIndicator={false}>
        {Object.keys(groupedItems).length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="cart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtext}>
              Create shopping lists and add items to see them here
            </Text>
            <Pressable
              style={styles.createListButton}
              onPress={() => {
                setSelectedList(undefined);
                setModalVisible(true);
              }}
            >
              <Ionicons name="list" size={20} color="#fff" />
              <Text style={styles.createListButtonText}>
                Create Shopping List
              </Text>
            </Pressable>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="search" size={64} color="#ccc" />
            <Text style={styles.emptyCartText}>No items found</Text>
            <Text style={styles.emptyCartSubtext}>
              Try adjusting your filters or search terms
            </Text>
            <Pressable
              style={styles.clearFiltersButton}
              onPress={handleResetFilters}
            >
              <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
            </Pressable>
          </View>
        ) : (
          (
            Object.entries(filteredGroupedItems) as [
              string,
              { listId: string; listColor: string; items: any[] },
            ][]
          ).map(([listName, group]) => (
            <View key={group.listId} style={styles.listSection}>
              <Pressable
                style={styles.listHeader}
                onPress={() => {
                  const list = state.lists.find((l) => l.id === group.listId);
                  if (list) handleViewList(list);
                }}
              >
                <View style={styles.listHeaderLeft}>
                  <View
                    style={[
                      styles.listColorDot,
                      { backgroundColor: group.listColor },
                    ]}
                  />
                  <Text style={styles.listTitle}>{listName}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#ccc" />
                </View>
                <Text style={styles.listItemCount}>
                  {group.items.length} items
                </Text>
              </Pressable>

              {group.items.map((item: any) => (
                <View key={item.id} style={styles.cartItem}>
                  <Pressable
                    style={styles.checkbox}
                    onPress={() => toggleItemChecked(group.listId, item.id)}
                  >
                    <Ionicons
                      name={item.checked ? "checkbox" : "square-outline"}
                      size={24}
                      color={item.checked ? "#4CAF50" : "#ccc"}
                    />
                  </Pressable>

                  <View style={styles.itemImage}>
                    <Text style={styles.itemEmoji}>🛒</Text>
                  </View>

                  <View style={styles.itemInfo}>
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removeItem(group.listId, item.id)}
                    >
                      <Ionicons name="close-circle" size={20} color="#999" />
                    </Pressable>
                    <Text
                      style={[
                        styles.itemName,
                        item.checked && styles.itemNameChecked,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <Text style={styles.itemWeight}>
                      {item.quantity} {item.unit}
                    </Text>
                    <Text style={styles.itemPrice}>${item.price} each</Text>
                  </View>

                  <View style={styles.quantitySection}>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(group.listId, item.id, -1)}
                    >
                      <Ionicons name="remove" size={16} color="#333" />
                    </Pressable>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(group.listId, item.id, 1)}
                    >
                      <Ionicons name="add" size={16} color="#333" />
                    </Pressable>
                  </View>

                  <View style={styles.subtotalSection}>
                    <Text style={styles.subtotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Promo Code */}
      <View style={styles.promoSection}>
        <View style={styles.promoInputContainer}>
          <Ionicons
            name="pricetag"
            size={20}
            color="#999"
            style={styles.promoIcon}
          />
          <TextInput
            style={styles.promoInput}
            placeholder="Enter promo code"
            value={promoCode}
            onChangeText={setPromoCode}
            placeholderTextColor="#999"
          />
          <Pressable style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </Pressable>
        </View>
      </View>

      {/* Order Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (8%)</Text>
          <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryTotal}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          <Text style={styles.summaryTotalValue}>${total.toFixed(2)}</Text>
        </View>

        <Pressable
          style={
            items.length === 0
              ? styles.checkoutButtonDisabled
              : styles.checkoutButton
          }
          disabled={items.length === 0}
        >
          <Ionicons
            name="lock-closed"
            size={18}
            color="#fff"
            style={styles.checkoutIcon}
          />
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </Pressable>

        <Text style={styles.secureText}>
          🔒 Secure checkout powered by Stripe
        </Text>
      </View>

      {/* Shopping List Modal */}
      <ShoppingListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        list={selectedList}
        mode={selectedList ? "view" : "create"}
      />

      {/* Cart Filters Modal */}
      <CartFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />
    </View>
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
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#FF4444",
    fontSize: 12,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  deliverySection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  deliveryOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deliveryText: {
    marginLeft: 12,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  deliverySubtitle: {
    fontSize: 14,
    color: "#666",
  },
  deliveryRight: {
    alignItems: "flex-end",
  },
  deliveryPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
  },
  cartItems: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  emptyCart: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 18,
    color: "#666",
    marginTop: 15,
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 40,
  },
  createListButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createListButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  listSection: {
    marginBottom: 20,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 2,
  },
  listHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  listColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginRight: 5,
  },
  listItemCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 2,
  },
  checkbox: {
    marginRight: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 2,
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    zIndex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  itemNameChecked: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  itemCategory: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
    marginBottom: 2,
  },
  itemWeight: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
  },
  quantitySection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 20,
    textAlign: "center",
    color: "#1A1A1A",
  },
  subtotalSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  subtotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  promoSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  promoInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  promoIcon: {
    marginRight: 10,
  },
  promoInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    paddingVertical: 10,
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  summary: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  checkoutButtonDisabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  checkoutIcon: {
    marginRight: 8,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secureText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  cartItemsHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  cartItemsTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cartItemsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  cartItemsActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  clearSearchButton: {
    padding: 5,
  },
  activeFiltersSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeFiltersText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  clearFiltersButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  clearFiltersButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
