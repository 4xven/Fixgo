// components/splashscreen.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../App";

type SplashScreenProp = NativeStackNavigationProp<RootStackParamList, "SplashScreen">;
type SplashScreenRouteProp = RouteProp<RootStackParamList, "SplashScreen">;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenProp>();
  const route = useRoute<SplashScreenRouteProp>();

  const nextScreen = route.params?.nextScreen || "CustomerLogin"; 
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(nextScreen); 
    }, 1000);

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
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
});