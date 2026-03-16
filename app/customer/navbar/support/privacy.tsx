import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function PrivacyPolicy() {

  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      {/* Policy Card */}
      <View style={styles.policyBox}>

        <Text style={styles.lastUpdated}>Last Updated: September 6, 2025</Text>

        <Text style={styles.paragraph}>
           {"\u00A0\u00A0\u00A0"} At FixGo, we take your privacy seriously. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit our
          mobile application.
        </Text>

        <Text style={styles.sectionTitle}>1. DATA COLLECTION</Text>
        <Text style={styles.paragraph}>
           {"\u00A0\u00A0\u00A0"}We collect personal information that you voluntarily provide to us when
          registering on the App, expressing an interest in obtaining information
          about us or our products and services, or otherwise contacting us. This
          includes name, email, phone number, and location data (GPS) to connect
          you with nearby technicians.
        </Text>

        <Text style={styles.sectionTitle}>2. HOW WE USE YOUR DATA</Text>
        <Text style={styles.paragraph}>
           {"\u00A0\u00A0\u00A0"}We use personal information collected via our App for a variety of business
          purposes described below. We process your personal information for these
          purposes in reliance on our legitimate business interests, in order to
          enter into or perform a contract with you, with your consent, and/or for
          compliance with our legal obligations.
        </Text>

        <Text style={styles.sectionTitle}>3. DATA SHARING</Text>
        <Text style={styles.paragraph}>
           {"\u00A0\u00A0\u00A0"}We only share information with your consent, to comply with laws, to provide
          you with services, to protect your rights, or to fulfill business
          obligations. We share your location and contact details with technicians
          only when you confirm a booking.
        </Text>

        <Text style={styles.sectionTitle}>4. YOUR RIGHTS</Text>
        <Text style={styles.paragraph}>
           {"\u00A0\u00A0\u00A0"}Depending on your location, you may have certain rights regarding your
          personal information, such as the right to access, correct, or delete the
          data we hold about you.
        </Text>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 20,
    paddingTop: 65,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backBtn: {
    paddingRight: 10,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },

  policyBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },

  lastUpdated: {
    fontSize: 13,
    color: "#777",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 5,
  },

  paragraph: {
    fontSize: 15,
    color: "#555",
    lineHeight: 20,
    marginBottom: 10,
    textAlign: "justify",
  },

});