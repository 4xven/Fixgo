import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { onSnapshot } from "firebase/firestore";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";

export default function Home() {
  const [userName, setUserName] = useState("User");
  const [userPhoto, setUserPhoto] = useState("");
  const [providers, setProviders] = useState<any[]>([]);

  const navigation = useNavigation<any>();

  // Fetch current user info
useFocusEffect(
  useCallback(() => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        setUserName(data.fullName || "User");

        if (data.photoBase64) {
  setUserPhoto(data.photoBase64);
} else {
  setUserPhoto("");
}
      }
    });

    return () => unsubscribe();
  }, [])
);

  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const q = query(collection(db, "users"), where("userType", "==", "Provider"));
        const querySnapshot = await getDocs(q);

        const providerList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          service: doc.data().service || [],
        }));

        setProviders(providerList);
      } catch (error) {
        console.log("Error fetching providers:", error);
      }
    };

    fetchProviders();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("CustomerLogin");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
         
          {userPhoto ? (
  <Image
    source={{
      uri: `data:image/jpeg;base64,${userPhoto}`,
    }}
    style={styles.avatar}
  />
) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#888" />
            </View>
          )}

          <Text style={styles.locationLabel}>Hello, {userName}!</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            placeholder="Search for information..."
            style={styles.searchInput}
          />
        </View>

        {/* AI Card */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() =>
            navigation.navigate("SplashScreen", { nextScreen: "AIChat" })
          }
        >
          <Ionicons name="sparkles-outline" size={22} color="#fff" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.aiTitle}>Ask FixGo AI</Text>
            <Text style={styles.aiSubtitle}>Get instant help & diagnosis</Text>
          </View>
        </TouchableOpacity>

        {/* Services */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
        </View>

        <View style={styles.servicesGrid}>
          {serviceItem("phone-portrait-outline", "Phone Repair", navigation)}
          {serviceItem("laptop-outline", "Laptop Repair", navigation)}
          {serviceItem("cube-outline", "Appliance Repair", navigation)}
          {serviceItem("construct-outline", "Plumbing Repair", navigation)}
          {serviceItem("flash-outline", "Electrical Repair", navigation)}
          {serviceItem("speedometer-outline", "Vehicle Repair", navigation)}
        </View>

        {/* Experts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Experts</Text>
        </View>

        {providers.map((provider) => {
          const services = Array.isArray(provider.service)
            ? provider.service
            : provider.service
            ? [provider.service]
            : [];

          return (
            <View style={styles.expertCard} key={provider.id}>
             <View style={styles.providerAvatar}>
  {provider.photoBase64 ? (
    <Image
      source={{
        uri: `data:image/jpeg;base64,${provider.photoBase64}`,
      }}
      style={{ width: 50, height: 50, borderRadius: 25 }}
    />
  ) : (
    <Ionicons name="person" size={40} color="#555" />
  )}
</View>

              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.expertName}>{provider.fullName}</Text>

                {services.map((s: string) => (
                  <Text key={s} style={styles.expertJob}>
                    {s}
                  </Text>
                ))}

                <View style={styles.ratingRow}>
                  <Text style={styles.distance}>
                    Total Jobs Done: {provider.totalJobs || 0}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() =>
                    navigation.navigate("SplashScreen", {
                      nextScreen: "BookingExpertScreen",
                      expert: provider,
                    })
                  }
                >
                  <Text style={styles.bookText}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function serviceItem(icon: any, label: string, navigation: any) {
  const handlePress = () => {
    navigation.navigate("SplashScreen", {
      nextScreen: "BookingScreen",
      serviceType: label,
    });
  };

  return (
    <TouchableOpacity style={styles.serviceBox} onPress={handlePress}>
      <Ionicons name={icon} size={24} color="#6C63FF" />
      <Text style={styles.serviceText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 20, paddingTop: 65 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: { width: 45, height: 45, borderRadius: 25, marginRight: 10 },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  locationLabel: { fontSize: 22, fontWeight: "700" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 10, marginVertical: 15 },
  searchInput: { marginLeft: 8, flex: 1, height: 40 },
  aiCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#4b465e", padding: 18, borderRadius: 15, marginBottom: 20 },
  aiTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  aiSubtitle: { color: "#ddd", fontSize: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  servicesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20, marginTop: 10 },
  serviceBox: { width: "30%", backgroundColor: "#fff", borderRadius: 12, padding: 15, alignItems: "center", marginBottom: 12 },
  serviceText: { fontSize: 12, marginTop: 5, textAlign: "center" },
  expertCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 15, padding: 15, alignItems: "center", marginBottom: 15 },
  providerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#eee", justifyContent: "center", alignItems: "center" },
  expertName: { fontWeight: "700" },
  expertJob: { color: "#777", fontSize: 12, marginTop: 5 },
  ratingRow: { marginTop: 5 },
  distance: { fontSize: 12, color: "#777" },
  bookBtn: { backgroundColor: "#4b465e", paddingVertical: 6, paddingHorizontal: 15, borderRadius: 8 },
  bookText: { color: "#fff" },
});