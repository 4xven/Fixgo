import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

import Home from "./navbar/home";
import Book from "./navbar/book";
import AIChat from "./navbar/aichat";
import Profile from "./navbar/profile";

const Tab = createBottomTabNavigator();

export default function CustomerTabs() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const handleTabPress = (screenName: string, e: any) => {
    e.preventDefault(); 
    navigation.replace("SplashScreen", { nextScreen: screenName });
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4A90E2",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
  height: Platform.OS === "android" ? 65 + insets.bottom : 65,
  paddingBottom: Platform.OS === "android" ? 8 + insets.bottom : 8,
  backgroundColor: "#fff",
},
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Book") iconName = "calendar-outline";
          else if (route.name === "AIChat") iconName = "sparkles-outline";
          else if (route.name === "Profile") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        listeners={{
          tabPress: (e) => handleTabPress("Home", e),
        }}
      />
      <Tab.Screen
        name="Book"
        component={Book}
        listeners={{
          tabPress: (e) => handleTabPress("Book", e),
        }}
      />
      <Tab.Screen
        name="AIChat"
        component={AIChat}
        options={{ title: "AI Chat" }}
        listeners={{
          tabPress: (e) => handleTabPress("AIChat", e),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        listeners={{
          tabPress: (e) => handleTabPress("Profile", e),
        }}
      />
    </Tab.Navigator>
  );
}