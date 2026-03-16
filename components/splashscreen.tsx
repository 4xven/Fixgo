import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../App";

type SplashScreenProp = NativeStackNavigationProp<RootStackParamList, "SplashScreen">;
type SplashScreenRouteProp = RouteProp<RootStackParamList, "SplashScreen">;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenProp>();
  const route = useRoute<SplashScreenRouteProp>();

  const nextScreen = route.params?.nextScreen || "CustomerLogin"; 
  const serviceType = route.params?.serviceType; 
  const expert = route.params?.expert; 

useEffect(() => {
  const timer = setTimeout(() => {
    // Screens inside CustomerTabs
    if (["Home", "Book", "AIChat", "Profile"].includes(nextScreen)) {
      navigation.replace("CustomerTabs", { screen: nextScreen as "Home" | "Book" | "AIChat" | "Profile" });
    } 
    // BookingScreen with serviceType
    else if (nextScreen === "BookingScreen") {
      navigation.replace("BookingScreen", { serviceType });
    } 
    // BookingExpertScreen with expert
    else if (nextScreen === "BookingExpertScreen") {
      const expert = route.params?.expert;
      navigation.replace("BookingExpertScreen", { expert });
    } 
    // Fallback
    else {
      navigation.replace(nextScreen as keyof RootStackParamList);
    }
  }, 500);

  return () => clearTimeout(timer);
}, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/img/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#4b465e" },
  logo: { width: 250, height: 150, marginBottom: 20 },
});