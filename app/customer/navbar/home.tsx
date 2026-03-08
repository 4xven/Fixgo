import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";

export default function Home() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      const db = getFirestore();

      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserName(docSnap.data().fullName);
        }
      }
    };

    fetchUser();
  }, []);

  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("CustomerLogin");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.locationLabel}>Hello, {userName}!</Text>

          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            placeholder="Search for services..."
            style={styles.searchInput}
          />
        </View>

        {/* AI Card */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => navigation.navigate("AIChat")}
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
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <View style={styles.servicesGrid}>
          {serviceItem("phone-portrait-outline", "Phone Repair")}
          {serviceItem("laptop-outline", "Laptop")}
          {serviceItem("cube-outline", "Appliance")}
          {serviceItem("construct-outline", "Plumbing")}
          {serviceItem("flash-outline", "Electrical")}
          {serviceItem("speedometer-outline", "AC Repair")}
        </View>

        {/* Nearby Experts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Experts</Text>
        </View>

        <View style={styles.expertCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#555" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.expertName}>Luis Robelo</Text>
            <Text style={styles.expertJob}>Phone Repair</Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFA500" />
              <Ionicons name="star" size={14} color="#FFA500" />
              <Ionicons name="star" size={14} color="#FFA500" />
              <Ionicons name="star" size={14} color="#FFA500" />
              <Ionicons name="star-outline" size={14} color="#FFA500" />
              <Text style={styles.review}>(8)</Text>
            </View>

            <Text style={styles.distance}>Available</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity style={styles.bookBtn}>
              <Text style={styles.bookText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.expertCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#555" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.expertName}>Jarl Jontilano</Text>
            <Text style={styles.expertJob}>Phone Repair</Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFA500" />
              <Ionicons name="star" size={14} color="#FFA500" />
              <Ionicons name="star" size={14} color="#FFA500" />
              <Ionicons name="star-outline" size={14} color="#FFA500" />
              <Ionicons name="star-outline" size={14} color="#FFA500" />
              <Text style={styles.review}>(12)</Text>
            </View>

            <Text style={styles.distance}>Available</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity style={styles.bookBtn}>
              <Text style={styles.bookText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function serviceItem(icon: any, label: string) {
  return (
    <TouchableOpacity style={styles.serviceBox}>
      <Ionicons name={icon} size={24} color="#6C63FF" />
      <Text style={styles.serviceText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 20,
    paddingTop: 65,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  locationLabel: {
    fontSize: 18,
    fontWeight: "700",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 15,
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    height: 40,
  },

  aiCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C63FF",
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
  },

  aiTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  aiSubtitle: {
    color: "#ddd",
    fontSize: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  seeAll: {
    color: "#4A90E2",
  },

  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  serviceBox: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 12,
  },

  serviceText: {
    fontSize: 12,
    marginTop: 5,
  },

  expertCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  expertName: {
    fontWeight: "700",
  },

  expertJob: {
    color: "#777",
    fontSize: 12,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  review: {
    marginLeft: 5,
    fontSize: 12,
    color: "#777",
  },

  distance: {
    fontSize: 12,
    color: "#777",
  },

  price: {
    fontWeight: "700",
    marginBottom: 8,
  },

  bookBtn: {
    backgroundColor: "#4A90E2",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  bookText: {
    color: "#fff",
  },
});
