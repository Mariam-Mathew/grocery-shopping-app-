import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface ListTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    price: number;
    notes?: string;
  }[];
  store: string;
}

interface ListTemplatesModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ListTemplate) => void;
}

const TEMPLATES: ListTemplate[] = [
  {
    id: "weekly-grocery",
    name: "Weekly Grocery",
    description: "Essential items for weekly grocery shopping",
    icon: "cart-outline",
    store: "Whole Foods",
    items: [
      {
        name: "Milk",
        category: "Dairy",
        quantity: 1,
        unit: "gallon",
        price: 4.99,
      },
      {
        name: "Bread",
        category: "Bakery",
        quantity: 2,
        unit: "loaf",
        price: 3.49,
      },
      {
        name: "Eggs",
        category: "Dairy",
        quantity: 1,
        unit: "dozen",
        price: 5.99,
      },
      {
        name: "Bananas",
        category: "Produce",
        quantity: 6,
        unit: "pcs",
        price: 0.69,
      },
      {
        name: "Chicken Breast",
        category: "Meat",
        quantity: 2,
        unit: "lbs",
        price: 7.99,
      },
      {
        name: "Rice",
        category: "Grains",
        quantity: 1,
        unit: "lbs",
        price: 2.99,
      },
      {
        name: "Pasta",
        category: "Grains",
        quantity: 2,
        unit: "lbs",
        price: 3.99,
      },
      {
        name: "Tomatoes",
        category: "Produce",
        quantity: 4,
        unit: "pcs",
        price: 1.29,
      },
      {
        name: "Cheese",
        category: "Dairy",
        quantity: 1,
        unit: "lbs",
        price: 8.99,
      },
      {
        name: "Yogurt",
        category: "Dairy",
        quantity: 4,
        unit: "pcs",
        price: 1.29,
      },
    ],
  },
  {
    id: "party-supplies",
    name: "Party Supplies",
    description: "Everything you need for a great party",
    icon: "beer-outline",
    store: "Costco",
    items: [
      {
        name: "Paper Plates",
        category: "Household",
        quantity: 50,
        unit: "pcs",
        price: 0.15,
      },
      {
        name: "Plastic Cups",
        category: "Household",
        quantity: 50,
        unit: "pcs",
        price: 0.12,
      },
      {
        name: "Napkins",
        category: "Household",
        quantity: 100,
        unit: "pcs",
        price: 0.05,
      },
      {
        name: "Soda",
        category: "Beverages",
        quantity: 5,
        unit: "liter",
        price: 1.99,
      },
      {
        name: "Chips",
        category: "Snacks",
        quantity: 10,
        unit: "bags",
        price: 3.99,
      },
      {
        name: "Pizza",
        category: "Frozen",
        quantity: 3,
        unit: "pcs",
        price: 12.99,
      },
      {
        name: "Ice Cream",
        category: "Frozen",
        quantity: 2,
        unit: "tubs",
        price: 5.99,
      },
      {
        name: "Balloons",
        category: "Party",
        quantity: 20,
        unit: "pcs",
        price: 0.1,
      },
      {
        name: "Cake",
        category: "Bakery",
        quantity: 1,
        unit: "pcs",
        price: 24.99,
      },
    ],
  },
  {
    id: "healthy-meal-prep",
    name: "Healthy Meal Prep",
    description: "Nutritious items for weekly meal preparation",
    icon: "nutrition-outline",
    store: "Trader Joe's",
    items: [
      {
        name: "Quinoa",
        category: "Grains",
        quantity: 2,
        unit: "lbs",
        price: 6.99,
      },
      {
        name: "Broccoli",
        category: "Produce",
        quantity: 3,
        unit: "lbs",
        price: 2.99,
      },
      {
        name: "Salmon",
        category: "Meat",
        quantity: 2,
        unit: "lbs",
        price: 14.99,
      },
      {
        name: "Sweet Potatoes",
        category: "Produce",
        quantity: 5,
        unit: "pcs",
        price: 1.29,
      },
      {
        name: "Avocados",
        category: "Produce",
        quantity: 6,
        unit: "pcs",
        price: 1.5,
      },
      {
        name: "Chicken Breast",
        category: "Meat",
        quantity: 3,
        unit: "lbs",
        price: 7.99,
      },
      {
        name: "Brown Rice",
        category: "Grains",
        quantity: 1,
        unit: "lbs",
        price: 3.99,
      },
      {
        name: "Spinach",
        category: "Produce",
        quantity: 2,
        unit: "bags",
        price: 2.99,
      },
      {
        name: "Olive Oil",
        category: "Condiments",
        quantity: 1,
        unit: "bottle",
        price: 8.99,
      },
    ],
  },
  {
    id: "breakfast-essentials",
    name: "Breakfast Essentials",
    description: "Start your day right with these breakfast items",
    icon: "sunny-outline",
    store: "Target",
    items: [
      {
        name: "Coffee",
        category: "Beverages",
        quantity: 1,
        unit: "lbs",
        price: 12.99,
      },
      {
        name: "Cereal",
        category: "Grains",
        quantity: 2,
        unit: "boxes",
        price: 4.99,
      },
      {
        name: "Orange Juice",
        category: "Beverages",
        quantity: 1,
        unit: "gallon",
        price: 5.99,
      },
      {
        name: "Butter",
        category: "Dairy",
        quantity: 2,
        unit: "sticks",
        price: 4.99,
      },
      {
        name: "Eggs",
        category: "Dairy",
        quantity: 2,
        unit: "dozen",
        price: 5.99,
      },
      {
        name: "Bacon",
        category: "Meat",
        quantity: 2,
        unit: "lbs",
        price: 8.99,
      },
      {
        name: "Bread",
        category: "Bakery",
        quantity: 1,
        unit: "loaf",
        price: 3.49,
      },
      {
        name: "Yogurt",
        category: "Dairy",
        quantity: 6,
        unit: "pcs",
        price: 1.29,
      },
    ],
  },
  {
    id: "bbq-supplies",
    name: "BBQ Supplies",
    description: "Everything you need for the perfect BBQ",
    icon: "flame-outline",
    store: "Whole Foods",
    items: [
      {
        name: "Burger Buns",
        category: "Bakery",
        quantity: 8,
        unit: "pcs",
        price: 0.99,
      },
      {
        name: "Ground Beef",
        category: "Meat",
        quantity: 5,
        unit: "lbs",
        price: 6.99,
      },
      {
        name: "BBQ Sauce",
        category: "Condiments",
        quantity: 2,
        unit: "bottles",
        price: 4.99,
      },
      {
        name: "Charcoal",
        category: "Household",
        quantity: 1,
        unit: "bag",
        price: 12.99,
      },
      {
        name: "Corn on Cob",
        category: "Produce",
        quantity: 8,
        unit: "pcs",
        price: 0.79,
      },
      {
        name: "Potato Salad",
        category: "Prepared",
        quantity: 2,
        unit: "lbs",
        price: 4.99,
      },
      {
        name: "Paper Plates",
        category: "Household",
        quantity: 20,
        unit: "pcs",
        price: 0.15,
      },
      {
        name: "Soda",
        category: "Beverages",
        quantity: 4,
        unit: "liter",
        price: 1.99,
      },
    ],
  },
];

export default function ListTemplatesModal({
  visible,
  onClose,
  onSelectTemplate,
}: ListTemplatesModalProps) {
  const handleSelectTemplate = (template: ListTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose a Template</Text>
        <Text style={styles.subtitle}>Start with a pre-made shopping list</Text>

        <View style={styles.templatesGrid}>
          {TEMPLATES.map((template) => (
            <Pressable
              key={template.id}
              style={styles.templateCard}
              onPress={() => handleSelectTemplate(template)}
            >
              <View style={styles.templateHeader}>
                <Ionicons
                  name={template.icon as any}
                  size={24}
                  color="#4CAF50"
                />
                <Text style={styles.templateName}>{template.name}</Text>
              </View>
              <Text style={styles.templateDescription}>
                {template.description}
              </Text>
              <View style={styles.templateMeta}>
                <Text style={styles.templateStore}>🛒 {template.store}</Text>
                <Text style={styles.templateItems}>
                  {template.items.length} items
                </Text>
                <Text style={styles.templateTotal}>
                  $
                  {template.items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Pressable style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  templatesGrid: {
    gap: 15,
  },
  templateCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  templateName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginLeft: 10,
  },
  templateDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  templateMeta: {
    gap: 8,
  },
  templateStore: {
    fontSize: 12,
    color: "#666",
  },
  templateItems: {
    fontSize: 12,
    color: "#666",
  },
  templateTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  closeButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
});
