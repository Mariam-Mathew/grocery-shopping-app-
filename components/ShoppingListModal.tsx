import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useShopping } from "../context/ShoppingContext";
import {
  CATEGORIES,
  LIST_COLORS,
  ShoppingList,
  STORES,
  UNITS,
} from "../types/shopping";
import ShoppingListFilters from "./ShoppingListFilters";

interface ShoppingListModalProps {
  visible: boolean;
  onClose: () => void;
  list?: ShoppingList;
  mode: "create" | "view" | "edit";
}

export default function ShoppingListModal({
  visible,
  onClose,
  list,
  mode,
}: ShoppingListModalProps) {
  const { state, dispatch } = useShopping();
  const [listName, setListName] = useState(list?.name || "");
  const [listDescription, setListDescription] = useState(
    list?.description || "",
  );
  const [selectedStore, setSelectedStore] = useState(
    list?.store || STORES[0].name,
  );
  const [selectedColor, setSelectedColor] = useState(
    list?.color || LIST_COLORS[0],
  );
  const [totalBudget, setTotalBudget] = useState(
    list?.totalBudget?.toString() || "",
  );
  const [showAddItem, setShowAddItem] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: CATEGORIES[0],
    quantity: 1,
    unit: UNITS[0],
    price: 0,
    notes: "",
  });

  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedStore: "all",
    selectedCategory: "all",
    priceRange: [0, 100] as [number, number],
    selectedUnits: [] as string[],
    showCheckedOnly: false,
    sortBy: "name" as "name" | "price" | "category" | "date",
    sortOrder: "asc" as "asc" | "desc",
  });

  const handleCreateList = () => {
    if (!listName.trim()) {
      Alert.alert("Error", "Please enter a list name");
      return;
    }

    dispatch({
      type: "CREATE_LIST",
      payload: {
        name: listName,
        description: listDescription,
        store: selectedStore,
        items: [],
        totalBudget: totalBudget ? parseFloat(totalBudget) : undefined,
        shared: false,
        color: selectedColor,
      },
    });

    onClose();
    resetForm();
  };

  const handleUpdateList = () => {
    if (!list || !listName.trim()) return;

    dispatch({
      type: "UPDATE_LIST",
      payload: {
        id: list.id,
        updates: {
          name: listName,
          description: listDescription,
          store: selectedStore,
          totalBudget: totalBudget ? parseFloat(totalBudget) : undefined,
          color: selectedColor,
        },
      },
    });

    onClose();
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    if (!list) return;

    dispatch({
      type: "ADD_ITEM",
      payload: {
        listId: list.id,
        item: {
          ...newItem,
          store: selectedStore,
          checked: false,
        },
      },
    });

    setNewItem({
      name: "",
      category: CATEGORIES[0],
      quantity: 1,
      unit: UNITS[0],
      price: 0,
      notes: "",
    });
    setShowAddItem(false);
  };

  const handleToggleItem = (itemId: string) => {
    if (!list) return;
    dispatch({
      type: "TOGGLE_ITEM_CHECKED",
      payload: { listId: list.id, itemId },
    });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!list) return;
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          dispatch({
            type: "DELETE_ITEM",
            payload: { listId: list.id, itemId },
          }),
      },
    ]);
  };

  const resetForm = () => {
    setListName("");
    setListDescription("");
    setSelectedStore(STORES[0].name);
    setSelectedColor(LIST_COLORS[0]);
    setTotalBudget("");
    setNewItem({
      name: "",
      category: CATEGORIES[0],
      quantity: 1,
      unit: UNITS[0],
      price: 0,
      notes: "",
    });
    setShowAddItem(false);
  };

  // Filter and sort items
  const filteredItems = useMemo(() => {
    if (!list) return [];

    let items = [...list.items];

    // Apply search filter
    if (filters.searchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.notes?.toLowerCase().includes(filters.searchQuery.toLowerCase()),
      );
    }

    // Apply store filter
    if (filters.selectedStore !== "all") {
      items = items.filter((item) => item.store === filters.selectedStore);
    }

    // Apply category filter
    if (filters.selectedCategory !== "all") {
      items = items.filter(
        (item) => item.category === filters.selectedCategory,
      );
    }

    // Apply price range filter
    items = items.filter((item) => {
      const itemTotal = item.price * item.quantity;
      return (
        itemTotal >= filters.priceRange[0] && itemTotal <= filters.priceRange[1]
      );
    });

    // Apply units filter
    if (filters.selectedUnits.length > 0) {
      items = items.filter((item) => filters.selectedUnits.includes(item.unit));
    }

    // Apply status filter
    if (filters.showCheckedOnly) {
      items = items.filter((item) => item.checked);
    }

    // Apply sorting
    items.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price * a.quantity - b.price * b.quantity;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return filters.sortOrder === "desc" ? -comparison : comparison;
    });

    return items;
  }, [list, filters]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.selectedStore !== "all") count++;
    if (filters.selectedCategory !== "all") count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) count++;
    if (filters.selectedUnits.length > 0) count++;
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
      priceRange: [0, 100],
      selectedUnits: [],
      showCheckedOnly: false,
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const listTotal =
    list?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const checkedItems = list?.items.filter((item) => item.checked).length || 0;
  const totalItems = list?.items.length || 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </Pressable>
          <Text style={styles.title}>
            {mode === "create"
              ? "Create List"
              : mode === "edit"
                ? "Edit List"
                : list?.name}
          </Text>
          {mode === "view" && (
            <Pressable onPress={() => {}}>
              <Ionicons name="ellipsis-vertical" size={24} color="#333" />
            </Pressable>
          )}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {(mode === "create" || mode === "edit") && (
            <>
              {/* List Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>List Details</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>List Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={listName}
                    onChangeText={setListName}
                    placeholder="Enter list name"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={listDescription}
                    onChangeText={setListDescription}
                    placeholder="Add a description (optional)"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Store</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {STORES.map((store) => (
                      <Pressable
                        key={store.id}
                        style={[
                          styles.storeChip,
                          selectedStore === store.name &&
                            styles.storeChipSelected,
                        ]}
                        onPress={() => setSelectedStore(store.name)}
                      >
                        <Text style={styles.storeLogo}>{store.logo}</Text>
                        <Text
                          style={[
                            styles.storeName,
                            selectedStore === store.name &&
                              styles.storeNameSelected,
                          ]}
                        >
                          {store.name}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Color</Text>
                  <View style={styles.colorRow}>
                    {LIST_COLORS.map((color) => (
                      <Pressable
                        key={color}
                        style={[
                          styles.colorCircle,
                          { backgroundColor: color },
                          selectedColor === color && styles.colorCircleSelected,
                        ]}
                        onPress={() => setSelectedColor(color)}
                      >
                        {selectedColor === color && (
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        )}
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Budget (optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={totalBudget}
                    onChangeText={setTotalBudget}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Action Button */}
              <Pressable
                style={[
                  styles.actionButton,
                  { backgroundColor: selectedColor },
                ]}
                onPress={
                  mode === "create" ? handleCreateList : handleUpdateList
                }
              >
                <Text style={styles.actionButtonText}>
                  {mode === "create" ? "Create List" : "Update List"}
                </Text>
              </Pressable>
            </>
          )}

          {mode === "view" && list && (
            <>
              {/* List Info */}
              <View style={[styles.listInfo, { borderLeftColor: list.color }]}>
                <View style={styles.listInfoHeader}>
                  <Text style={styles.listName}>{list.name}</Text>
                  <View style={styles.listStats}>
                    <Text style={styles.listStat}>
                      {checkedItems}/{totalItems} items
                    </Text>
                    <Text style={styles.listStat}>${listTotal.toFixed(2)}</Text>
                  </View>
                </View>
                {list.description && (
                  <Text style={styles.listDescription}>{list.description}</Text>
                )}
                <View style={styles.listMeta}>
                  <Text style={styles.listStore}>🛒 {list.store}</Text>
                  {list.totalBudget && (
                    <Text style={styles.listBudget}>
                      Budget: ${list.totalBudget.toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>

              {/* Add Item Button */}
              <Pressable
                style={styles.addItemButton}
                onPress={() => setShowAddItem(true)}
              >
                <Ionicons name="add" size={20} color="#4CAF50" />
                <Text style={styles.addItemText}>Add Item</Text>
              </Pressable>

              {/* Add Item Form */}
              {showAddItem && (
                <View style={styles.addItemForm}>
                  <Text style={styles.formTitle}>Add New Item</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Item Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={newItem.name}
                      onChangeText={(text) =>
                        setNewItem({ ...newItem, name: text })
                      }
                      placeholder="Enter item name"
                      placeholderTextColor="#999"
                    />
                  </View>

                  <View style={styles.row}>
                    <View
                      style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}
                    >
                      <Text style={styles.label}>Quantity</Text>
                      <TextInput
                        style={styles.input}
                        value={newItem.quantity.toString()}
                        onChangeText={(text) =>
                          setNewItem({
                            ...newItem,
                            quantity: parseInt(text) || 1,
                          })
                        }
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.label}>Unit</Text>
                      <TextInput
                        style={styles.input}
                        value={newItem.unit}
                        onChangeText={(text) =>
                          setNewItem({ ...newItem, unit: text })
                        }
                        placeholder="pcs"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {CATEGORIES.map((category) => (
                        <Pressable
                          key={category}
                          style={[
                            styles.categoryChip,
                            newItem.category === category &&
                              styles.categoryChipSelected,
                          ]}
                          onPress={() => setNewItem({ ...newItem, category })}
                        >
                          <Text
                            style={[
                              styles.categoryText,
                              newItem.category === category &&
                                styles.categoryTextSelected,
                            ]}
                          >
                            {category}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.row}>
                    <View
                      style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}
                    >
                      <Text style={styles.label}>Price</Text>
                      <TextInput
                        style={styles.input}
                        value={newItem.price.toString()}
                        onChangeText={(text) =>
                          setNewItem({
                            ...newItem,
                            price: parseFloat(text) || 0,
                          })
                        }
                        keyboardType="numeric"
                        placeholder="0.00"
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.label}>Notes</Text>
                      <TextInput
                        style={styles.input}
                        value={newItem.notes}
                        onChangeText={(text) =>
                          setNewItem({ ...newItem, notes: text })
                        }
                        placeholder="Optional notes"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  <View style={styles.formActions}>
                    <Pressable
                      style={[styles.formButton, styles.cancelButton]}
                      onPress={() => setShowAddItem(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.formButton, styles.addButton]}
                      onPress={handleAddItem}
                    >
                      <Text style={styles.addButtonText}>Add Item</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Items List */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Items ({list.items.length})
                  </Text>
                  <View style={styles.sectionActions}>
                    <Pressable
                      style={styles.filterButton}
                      onPress={() => setShowFilters(true)}
                    >
                      <Ionicons name="filter" size={16} color="#4CAF50" />
                      <Text style={styles.filterButtonText}>
                        Filters{" "}
                        {getActiveFiltersCount() > 0 &&
                          `(${getActiveFiltersCount()})`}
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
                      Showing {filteredItems.length} of {list.items.length}{" "}
                      items
                    </Text>
                    <Pressable onPress={handleResetFilters}>
                      <Text style={styles.clearFiltersText}>Clear all</Text>
                    </Pressable>
                  </View>
                )}

                {list.items.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="basket-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>No items yet</Text>
                    <Text style={styles.emptySubtext}>
                      Add your first item to get started
                    </Text>
                  </View>
                ) : filteredItems.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="search" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>No items found</Text>
                    <Text style={styles.emptySubtext}>
                      Try adjusting your filters or search terms
                    </Text>
                    <Pressable
                      style={styles.clearFiltersButton}
                      onPress={handleResetFilters}
                    >
                      <Text style={styles.clearFiltersButtonText}>
                        Clear Filters
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  filteredItems.map((item: any) => (
                    <View key={item.id} style={styles.itemCard}>
                      <Pressable
                        style={styles.itemCheckbox}
                        onPress={() => handleToggleItem(item.id)}
                      >
                        <Ionicons
                          name={item.checked ? "checkbox" : "square-outline"}
                          size={24}
                          color={item.checked ? "#4CAF50" : "#ccc"}
                        />
                      </Pressable>

                      <View style={styles.itemInfo}>
                        <Text
                          style={[
                            styles.itemName,
                            item.checked && styles.itemNameChecked,
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text style={styles.itemDetails}>
                          {item.quantity} {item.unit} • {item.category}
                        </Text>
                        {item.notes && (
                          <Text style={styles.itemNotes}>{item.notes}</Text>
                        )}
                      </View>

                      <View style={styles.itemRight}>
                        <Text style={styles.itemPrice}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                        <Pressable
                          style={styles.deleteButton}
                          onPress={() => handleDeleteItem(item.id)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#FF4444"
                          />
                        </Pressable>
                      </View>
                    </View>
                  ))
                )}
              </View>

              {/* Summary */}
              {list.items.length > 0 && (
                <View style={styles.summary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>
                      ${listTotal.toFixed(2)}
                    </Text>
                  </View>
                  {list.totalBudget && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Budget</Text>
                      <Text
                        style={[
                          styles.summaryValue,
                          listTotal > list.totalBudget && styles.overBudget,
                        ]}
                      >
                        ${list.totalBudget.toFixed(2)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotal}>Total</Text>
                    <Text style={styles.summaryTotalValue}>
                      ${listTotal.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>

      {/* Filters Modal */}
      <ShoppingListFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1A1A1A",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  storeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    marginRight: 10,
  },
  storeChipSelected: {
    backgroundColor: "#4CAF50",
  },
  storeLogo: {
    fontSize: 16,
    marginRight: 6,
  },
  storeName: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  storeNameSelected: {
    color: "#fff",
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: "#333",
  },
  actionButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listInfo: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  listInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  listStats: {
    alignItems: "flex-end",
  },
  listStat: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  listDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  listMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listStore: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  listBudget: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
  },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderStyle: "dashed",
  },
  addItemText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 8,
  },
  addItemForm: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: "#4CAF50",
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  categoryTextSelected: {
    color: "#fff",
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#4CAF50",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemCheckbox: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  itemNameChecked: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  itemNotes: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  itemRight: {
    alignItems: "flex-end",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 5,
  },
  deleteButton: {
    padding: 5,
  },
  summary: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  overBudget: {
    color: "#FF4444",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionActions: {
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
    marginBottom: 15,
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
    marginBottom: 15,
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
