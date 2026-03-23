import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch } from "react-native";
import { Text, View } from "../../components/Themed";

const settingsOptions = [
  {
    id: 1,
    title: "Push Notifications",
    subtitle: "Get updates on orders and deals",
    icon: "notifications",
    type: "toggle",
    value: true,
  },
  {
    id: 2,
    title: "Dark Mode",
    subtitle: "Enable dark theme",
    icon: "moon",
    type: "toggle",
    value: false,
  },
  {
    id: 3,
    title: "Location Services",
    subtitle: "Allow app to access your location",
    icon: "location",
    type: "toggle",
    value: true,
  },
  {
    id: 4,
    title: "Face ID / Touch ID",
    subtitle: "Use biometric authentication",
    icon: "finger-print",
    type: "toggle",
    value: false,
  },
];

const accountOptions = [
  {
    id: 1,
    title: "Personal Information",
    subtitle: "Update your profile details",
    icon: "person",
    type: "navigation",
  },
  {
    id: 2,
    title: "Payment Methods",
    subtitle: "Manage your payment options",
    icon: "card",
    type: "navigation",
  },
  {
    id: 3,
    title: "Delivery Addresses",
    subtitle: "Manage your delivery addresses",
    icon: "location",
    type: "navigation",
  },
  {
    id: 4,
    title: "Order History",
    subtitle: "View your past orders",
    icon: "time",
    type: "navigation",
  },
  {
    id: 5,
    title: "Favorites",
    subtitle: "View your favorite items",
    icon: "heart",
    type: "navigation",
  },
];

const supportOptions = [
  {
    id: 1,
    title: "Help Center",
    subtitle: "Get help and support",
    icon: "help-circle",
    type: "navigation",
  },
  {
    id: 2,
    title: "Contact Us",
    subtitle: "Get in touch with our team",
    icon: "mail",
    type: "navigation",
  },
  {
    id: 3,
    title: "Privacy Policy",
    subtitle: "Read our privacy policy",
    icon: "lock-closed",
    type: "navigation",
  },
  {
    id: 4,
    title: "Terms of Service",
    subtitle: "Read our terms of service",
    icon: "document-text",
    type: "navigation",
  },
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState(settingsOptions);

  const toggleSetting = (id: number) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? { ...setting, value: !setting.value } : setting,
      ),
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SJ</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>Sarah Johnson</Text>
            <Text style={styles.profileEmail}>sarah.johnson@email.com</Text>
            <Pressable style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </Pressable>
          </View>
        </View>
        <Pressable style={styles.membershipBadge}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.membershipText}>Premium</Text>
        </Pressable>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>47</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>$2,847</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>23</Text>
          <Text style={styles.statLabel}>Saved Items</Text>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          {settings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons
                    name={setting.icon as any}
                    size={20}
                    color="#4CAF50"
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                </View>
              </View>
              <Switch
                value={setting.value}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
                thumbColor={setting.value ? "#fff" : "#f4f3f4"}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          {accountOptions.map((option) => (
            <Pressable key={option.id} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color="#2196F3"
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          {supportOptions.map((option) => (
            <Pressable key={option.id} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color="#FF9800"
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </Pressable>
          ))}
        </View>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <View style={styles.appInfoItem}>
          <Text style={styles.appInfoLabel}>Version</Text>
          <Text style={styles.appInfoValue}>2.1.0</Text>
        </View>
        <View style={styles.appInfoItem}>
          <Text style={styles.appInfoLabel}>Build</Text>
          <Text style={styles.appInfoValue}>2024.03.19</Text>
        </View>
      </View>

      {/* Sign Out Button */}
      <View style={styles.section}>
        <Pressable style={styles.logoutButton}>
          <Ionicons
            name="log-out"
            size={20}
            color="#fff"
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by Grocery App Team</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  profileHeader: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  editProfileButton: {
    alignSelf: "flex-start",
  },
  editProfileText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  membershipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  membershipText: {
    fontSize: 12,
    color: "#FF8F00",
    fontWeight: "600",
    marginLeft: 4,
  },
  statsSection: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  appInfo: {
    flexDirection: "row",
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
  appInfoItem: {
    flex: 1,
    alignItems: "center",
  },
  appInfoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  appInfoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4444",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});
