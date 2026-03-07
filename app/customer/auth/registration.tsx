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

export default function Registration() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<"Customer" | "Provider">("Customer");

  type RegistrationScreenProp = NativeStackNavigationProp<
    RootStackParamList,
    "CustomerRegistration"
  >;
  const navigation = useNavigation<RegistrationScreenProp>();

  const signUp = () => {
    // Add your registration logic here
    console.log({ fullName, email, password, phone, userType });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/img/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Registration Card */}
      <View style={styles.card}>
        <Text style={styles.getStarted}>Registration</Text>

        {/* Customer / Provider Toggle */}
        <View style={styles.toggleContainer}>
          {/* Customer button */}
          <TouchableOpacity
            style={[
              styles.toggleButton,
              userType === "Customer" && styles.activeToggle,
            ]}
            onPress={() => navigation.navigate("CustomerRegistration")}
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

          {/* Provider button */}
          <TouchableOpacity
            style={[
              styles.toggleButton,
              userType === "Provider" && styles.activeToggle,
            ]}
            onPress={() => navigation.navigate("ProviderRegistration")}
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
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full Name"
            placeholderTextColor="#888"
          />
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
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Phone Number"
            placeholderTextColor="#888"
          />
        </KeyboardAvoidingView>

        {/* Create Account Button */}
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("CustomerLogin")}>
          <Text style={styles.loginButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("CustomerLogin")}>
          <Text style={styles.signUpText}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
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
  getStarted: {
    alignSelf: "center",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 40,
  },
  subText: {
    fontSize: 14,
    color: "#9e8d95",
    marginBottom: 25,
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
    color: "#000",
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
