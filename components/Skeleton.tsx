import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { BorderRadius, Colors, Spacing } from "../constants/Theme";

const Shadow = {
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
  animationDuration?: number;
}

export default function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = BorderRadius.md,
  style,
  animationDuration = 1000,
}: SkeletonProps) {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue, animationDuration]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Pre-defined skeleton components
export const CardSkeleton = () => (
  <View style={styles.cardContainer}>
    <Skeleton
      height={120}
      borderRadius={BorderRadius.lg}
      style={styles.cardImage}
    />
    <View style={styles.cardContent}>
      <Skeleton height={20} width="80%" style={styles.cardTitle} />
      <Skeleton height={16} width="60%" style={styles.cardSubtitle} />
      <Skeleton height={16} width="40%" style={styles.cardPrice} />
    </View>
  </View>
);

export const ListSkeleton = () => (
  <View style={styles.listContainer}>
    {Array.from({ length: 5 }).map((_, index) => (
      <View key={index} style={styles.listItem}>
        <Skeleton height={40} width={40} borderRadius={BorderRadius.lg} />
        <View style={styles.listContent}>
          <Skeleton height={16} width="70%" style={styles.listTitle} />
          <Skeleton height={14} width="50%" style={styles.listSubtitle} />
        </View>
        <Skeleton height={24} width={24} borderRadius={BorderRadius.lg} />
      </View>
    ))}
  </View>
);

export const CategorySkeleton = () => (
  <View style={styles.categoryContainer}>
    {Array.from({ length: 6 }).map((_, index) => (
      <View key={index} style={styles.categoryItem}>
        <Skeleton height={60} width={60} borderRadius={BorderRadius.full} />
        <Skeleton height={16} width="80%" style={styles.categoryName} />
        <Skeleton height={14} width="60%" style={styles.categoryCount} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.neutral[200],
  },
  cardContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  cardImage: {
    marginBottom: Spacing.md,
  },
  cardContent: {
    gap: Spacing.sm,
  },
  cardTitle: {
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    marginBottom: Spacing.xs,
  },
  cardPrice: {
    alignSelf: "flex-start",
  },
  listContainer: {
    paddingHorizontal: Spacing.md,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listContent: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: Spacing.xs,
  },
  listTitle: {
    marginBottom: Spacing.xs,
  },
  listSubtitle: {
    alignSelf: "flex-start",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
  },
  categoryItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  categoryName: {
    marginBottom: Spacing.xs,
  },
  categoryCount: {
    alignSelf: "center",
  },
});
