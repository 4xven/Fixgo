import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Modal, FlatList } from "react-native";

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

const services = [
  "Phone Repair",
  "Desktop/Laptop Repair",
  "Appliance Repair",
  "Plumbing Repair",
  "Electrical Repair",
  "Vehicle Repair",
];

export default function ProviderRegistration() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"Customer" | "Provider">("Provider");
  const [showPassword, setShowPassword] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  type RegistrationScreenProp = NativeStackNavigationProp<
    RootStackParamList,
    "ProviderRegistration"
  >;

  const navigation = useNavigation<RegistrationScreenProp>();

  const register = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setFullNameError("");
    setPhoneError("");
    setServiceError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");

    if (!fullName) {
      setFullNameError("Full name is required");
      return;
    }

    if (!phone) {
      setPhoneError("Phone number is required");
      return;
    }

    if (service.length === 0) {
      setServiceError("Select at least one service");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Invalid email");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        phone,
        service, // this is now an array
        email,
        userType,
        createdAt: new Date(),
      });

      setSuccessMessage("Account created successfully!");

      setTimeout(() => {
        navigation.navigate("ProviderLogin");
      }, 1500);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setEmailError("Email already registered");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/img/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.getStarted}>Provider Registration</Text>

          {/* Toggle */}
          <View style={styles.toggleContainer}>
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

            <TouchableOpacity
              style={[
                styles.toggleButton,
                userType === "Provider" && styles.activeToggle,
              ]}
              onPress={() => setUserType("Provider")}
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

          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="person"
              size={22}
              color={fullNameError ? "red" : "#555"}
              style={styles.leftIcon}
            />
            <TextInput
              style={styles.inputWithIcon}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setFullNameError("");
              }}
              placeholder={fullNameError || "Full Name"}
              placeholderTextColor={fullNameError ? "red" : "#888"}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="phone"
              size={22}
              color={phoneError ? "red" : "#555"}
              style={styles.leftIcon}
            />
            <TextInput
              style={styles.inputWithIcon}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setPhoneError("");
              }}
              keyboardType="phone-pad"
              placeholder={phoneError || "Phone Number"}
              placeholderTextColor={phoneError ? "red" : "#888"}
            />
          </View>

          {/* Service Multi-Select */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="miscellaneous-services"
              size={22}
              color={serviceError ? "red" : "#555"}
              style={styles.leftIcon}
            />
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setServiceModalVisible(true)}
            >
              <Text style={{ color: service.length > 0 ? "#000" : "#888" }}>
                {service.length > 0
                  ? service.join(", ")
                  : serviceError || "Select Service(s)"}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={serviceModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setServiceModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setServiceModalVisible(false)}
              activeOpacity={1}
            >
              <View style={styles.modalContent}>
                <FlatList
                  data={services}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => {
                    const selected = service.includes(item);
                    return (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          if (selected) {
                            setService(service.filter((s) => s !== item));
                          } else {
                            setService([...service, item]);
                          }
                          setServiceError("");
                        }}
                      >
                        <View style={styles.radioOuter}>
                          {selected && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.radioText}>{item}</Text>
                      </TouchableOpacity>
                    );
                  }}
                />
                <TouchableOpacity
                  style={styles.modalDoneButton}
                  onPress={() => setServiceModalVisible(false)}
                >
                  <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Email */}
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
                setEmailError("");
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder={emailError || "Email"}
              placeholderTextColor={emailError ? "red" : "#888"}
            />
          </View>

          {/* Password */}
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
                setPasswordError("");
              }}
              placeholder={passwordError || "Password"}
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

          {/* Confirm Password */}
          <View style={styles.passwordContainer}>
            <MaterialIcons
              name="lock"
              size={22}
              color={confirmError ? "red" : "#555"}
              style={styles.leftIcon}
            />
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmError("");
              }}
              placeholder={confirmError || "Confirm Password"}
              placeholderTextColor={confirmError ? "red" : "#888"}
              secureTextEntry={!showPassword}
            />
          </View>

          {/* Register */}
          <TouchableOpacity style={styles.loginButton} onPress={register}>
            <Text style={styles.loginButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ProviderLogin")}>
            <Text style={styles.signUpText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#413c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  getStarted: { fontWeight: "bold", fontSize: 26, marginBottom: 20 },
  header: { alignItems: "center", marginBottom: 20 },
  logo: { width: 250, height: 150 },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    borderRadius: 25,
    backgroundColor: "#e0c8c8",
  },
  toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 25, alignItems: "center" },
  toggleText: { color: "#5b4b4b" },
  activeToggle: { backgroundColor: "#4b465e" },
  activeToggleText: { color: "#fff" },
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
  leftIcon: { marginRight: 10 },
  inputWithIcon: { flex: 1 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d8c6c6",
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 15,
    height: 50,
    width: "100%",
  },
  passwordInput: { flex: 1 },
  eyeIcon: { position: "absolute", right: 15 },
  loginButton: {
    backgroundColor: "#4b465e",
    marginVertical: 15,
    paddingVertical: 15,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: { color: "#fff", fontSize: 16 },
  signUpText: { color: "#5a4cff" },
  successText: { color: "green", marginBottom: 10 },

  // Modal & multi-select styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", width: "80%", borderRadius: 15, padding: 15, maxHeight: "60%" },
  modalItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  radioOuter: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: "#999", justifyContent: "center", alignItems: "center", marginRight: 10 },
  radioInner: { width: 12, height: 12, borderRadius: 3, backgroundColor: "#4b465e" },
  radioText: { fontSize: 16 },
  modalDoneButton: { marginTop: 15, paddingVertical: 10, backgroundColor: "#4b465e", borderRadius: 10, alignItems: "center" },
  modalDoneText: { color: "#fff", fontWeight: "bold" },
});