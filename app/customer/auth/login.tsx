import { registerRootComponent } from "expo";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { useNavigation } from "@react-navigation/native";

import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"Customer" | "Provider">("Customer");

  type LoginScreenProp = NativeStackNavigationProp<
    RootStackParamList,
    "CustomerLogin"
  >;
  const navigation = useNavigation<LoginScreenProp>();

  const signIn = () => {
  // Optional: You could validate email/password here
  if (email && password) {
    navigation.navigate("Home");
  } else {
    alert("Please enter your email and password");
  }
};



  const signUp = () => {};

  return (
    <View style={styles.container}>
      {/* Header outside the card */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/img/logo.png")}
          style={styles.logo}
          resizeMode="contain" // ensures image scales properly
        />
      </View>

      {/* Login Card */}
      <View style={styles.card}>
        <Text style={styles.getStarted}>Login</Text>

        {/* Customer / Provider Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              userType === "Customer" && styles.activeToggle,
            ]}
            onPress={() => {
              setUserType("Customer");
              // Stay on Customer login
            }}
          >
            <Text
              style={[
                styles.toggleText,
                userType === "Customer" && styles.activeToggleText,
              ]}
            >
              Customer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              userType === "Provider" && styles.activeToggle,
            ]}
            onPress={() => navigation.navigate("ProviderLogin")}
          >
            <Text
              style={[
                styles.toggleText,
                userType === "Provider" && styles.activeToggleText,
              ]}
            >
              Provider
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <KeyboardAvoidingView behavior="padding" style={{ width: "100%" }}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#888"
          />
        </KeyboardAvoidingView>

        {/* Log In Button */}
        <TouchableOpacity style={styles.loginButton} onPress={signIn}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("CustomerRegistration")}
        >
          <Text style={styles.signUpText}>Don’t have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe5e5", // soft pastel background
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#9e8d95",
    marginBottom: 20,
  },
  getStarted: {
    alignSelf: "center",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 40,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    borderRadius: 25,
    backgroundColor: "#e0c8c8",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  toggleText: {
    color: "#5b4b4b",
    fontWeight: "500",
  },
  activeToggle: {
    backgroundColor: "#4b465e",
  },
  activeToggleText: {
    color: "#fff",
  },
  input: {
    marginVertical: 8,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: "#d8c6c6",
    color: "#000000",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#000",
    marginVertical: 15,
    paddingVertical: 15,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  signUpText: {
    color: "#5a4cff",
    fontSize: 14,
    marginTop: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 450,
    height: 150,
  },
});
