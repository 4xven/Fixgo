import { registerRootComponent } from "expo";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
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

  // Inside your signIn function
const signIn = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  setEmailError("");
  setPasswordError("");
  setLoginError("");

  if (!email) {
    setEmailError("Email is required");
    return;
  }

  if (!emailRegex.test(email)) {
    setEmail("");
    setEmailError("Invalid email format");
    return;
  }

  if (!password) {
    setPasswordError("Password is required");
    return;
  }

  if (password.length < 6) {
    setPassword("");
    setPasswordError("Invalid password");
    return;
  }

  try {

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    console.log("Logged in:", user.email);

    navigation.replace("SplashScreen", { nextScreen: "Home" });

  } catch (error: any) {

    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      setPassword("");
      setLoginError("No account found with this email and password");

        setTimeout(() => {
      setLoginError("");
    }, 3000);
    }

    else if (error.code === "auth/invalid-email") {
      setEmailError("Invalid email format");
    }

    else {
      alert("Login failed. Please try again.");
      console.log(error);
    }
  }
};

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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

          {loginError ? (
  <Text style={styles.loginError}>{loginError}</Text>
) : null}

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
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="email"
                size={22}
                color={emailError ? "red" : "#555"}
                style={styles.leftIcon}
              />
              <TextInput
                style={styles.inputWithIcon}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError(""); // reset error when typing
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder={emailError || "Email"} // show error placeholder
                placeholderTextColor={emailError ? "red" : "#888"}
                maxLength={50}
              />
            </View>

            {/* Password Input */}
            <View style={styles.passwordContainer}>
              <MaterialIcons
                name="lock"
                size={22}
                color={passwordError ? "red" : "#555"}
                style={styles.leftIcon}
              />
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError(""); // reset error when typing
                }}
                placeholder={passwordError || "Password"} // show error placeholder
                placeholderTextColor={passwordError ? "red" : "#888"}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={22}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

          {/* Log In Button */}
          <TouchableOpacity style={styles.loginButton} onPress={signIn}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("CustomerRegistration")}
          >
            <Text style={styles.signUpText}>
              Don’t have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: "#4b465e",
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

  passwordInput: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "#d8c6c6",
    color: "#000",
    fontSize: 16,
    paddingRight: 40,
    flex: 1,
  },

  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 14,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d8c6c6",
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 15,
    height: 50,
    width: "100%",
  },

  leftIcon: {
    marginRight: 10,
  },

  inputWithIcon: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d8c6c6",
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 15,
    height: 50,
    width: "100%",
    position: "relative",
  },

  errorInput: {
    borderWidth: 2,
    borderColor: "red",
  },

  errorText: {
    color: "red",
    fontSize: 13,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 5,
  },

  loginError: {
  color: "#ff4d4d",
  marginBottom: 20,
  textAlign: "center",
  width: "100%",
  fontWeight: "500",
},
});
