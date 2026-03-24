import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Spacing } from "../constants/Theme";

const TextStyles = {
  h3: {
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
    color: Colors.text,
  },
  body2: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: Colors.textInverse,
  },
};

const Shadow = {
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};

const BorderRadius = {
  lg: 12,
  full: 9999,
};

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  variant?: "default" | "cart" | "list" | "search";
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  variant = "default",
}: EmptyStateProps) {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case "cart":
        return {
          iconColor: Colors.primary[500],
          actionColor: Colors.primary[500],
        };
      case "list":
        return {
          iconColor: Colors.secondary[500],
          actionColor: Colors.secondary[500],
        };
      case "search":
        return {
          iconColor: Colors.warning,
          actionColor: Colors.warning,
        };
      default:
        return {
          iconColor: Colors.primary[500],
          actionColor: Colors.primary[500],
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: animatedValue,
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${variantStyles.iconColor}15` },
          ]}
        >
          <Ionicons
            name={icon as any}
            size={64}
            color={variantStyles.iconColor}
          />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {actionText && onAction && (
          <Pressable
            style={[
              styles.actionButton,
              { backgroundColor: variantStyles.actionColor },
            ]}
            onPress={onAction}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color="#fff"
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>{actionText}</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    minHeight: 400,
  },
  content: {
    alignItems: "center",
    maxWidth: 300,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    ...Shadow.lg,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
    textAlign: "center",
    marginBottom: Spacing.sm,
    color: Colors.text,
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: Spacing.xl,
    color: Colors.textSecondary,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadow.md,
  },
  actionIcon: {
    marginRight: Spacing.sm,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: Colors.textInverse,
  },
});
