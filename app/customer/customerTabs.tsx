import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "./navbar/home";
import Book from "./navbar/book";
import AIChat from "./navbar/aichat";
import Profile from "./navbar/profile";

const Tab = createBottomTabNavigator();

export default function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4A90E2",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
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
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Book" component={Book} />
      <Tab.Screen
        name="AIChat"
        component={AIChat}
        options={{ title: "AI Chat" }}
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
