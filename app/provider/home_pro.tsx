import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

export default function HomeProvider() {
  type HomeScreenProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<HomeScreenProp>();

  const handleLogout = () => {
    navigation.replace("CustomerLogin"); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Home Page for Provider</Text>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("SplashScreen", { nextScreen: "CustomerLogin" })
        }
      >
        <Text style={{ color: "#000000", fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe5e5",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
