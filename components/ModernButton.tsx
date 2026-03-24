import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  icon?: string;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function ModernButton({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ModernButtonProps) {
  const animatedValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[size],
      opacity: disabled ? 0.5 : 1,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: "#4CAF50",
          borderWidth: 0,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: "#2196F3",
          borderWidth: 0,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: "#4CAF50",
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    let baseStyle: TextStyle = {
      ...styles.text,
    };

    // Add size-specific styles
    switch (size) {
      case "small":
        baseStyle = {
          ...baseStyle,
          ...styles.smallText,
        };
        break;
      case "medium":
        baseStyle = {
          ...baseStyle,
          ...styles.mediumText,
        };
        break;
      case "large":
        baseStyle = {
          ...baseStyle,
          ...styles.largeText,
        };
        break;
      default:
        baseStyle = {
          ...baseStyle,
          ...styles.mediumText,
        };
    }

    // Add variant-specific color
    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          color: "#fff",
        };
      case "secondary":
        return {
          ...baseStyle,
          color: "#fff",
        };
      case "outline":
        return {
          ...baseStyle,
          color: "#4CAF50",
        };
      case "ghost":
        return {
          ...baseStyle,
          color: "#4CAF50",
        };
      default:
        return baseStyle;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Animated.View style={styles.loadingContainer}>
          <Text style={getTextStyle()}>Loading...</Text>
        </Animated.View>
      );
    }

    const iconComponent = icon ? (
      <Ionicons
        name={icon as any}
        size={size === "small" ? 16 : size === "large" ? 24 : 20}
        color={
          variant === "primary" || variant === "secondary" ? "#fff" : "#4CAF50"
        }
      />
    ) : null;

    return (
      <Animated.View
        style={[
          styles.buttonContent,
          { transform: [{ scale: animatedValue }] },
        ]}
      >
        {icon && iconPosition === "left" && (
          <View style={styles.iconLeft}>{iconComponent}</View>
        )}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        {icon && iconPosition === "right" && (
          <View style={styles.iconRight}>{iconComponent}</View>
        )}
      </Animated.View>
    );
  };

  return (
    <Pressable
      style={[getButtonStyle(), style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      {renderContent()}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
