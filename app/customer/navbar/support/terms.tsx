import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function TermsOfService() {

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

        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      {/* Terms Card */}
      <View style={styles.policyBox}>

        <Text style={styles.lastUpdated}>Effective Date: September 6, 2025</Text>

        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0"}Welcome to FixGo. These Terms of Service govern your use of the
          FixGo mobile application and the services provided therein. By using our
          app, you agree to these terms.
        </Text>

        <Text style={styles.sectionTitle}>1. ACCEPTANCE OF TERMS</Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0"}By accessing or using the FixGo application, you agree to be
          bound by these Terms. If you disagree with any part of the terms, then
          you may not access the service.
        </Text>

        <Text style={styles.sectionTitle}>2. SERVICE DESCRIPTION</Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0"}FixGo is a platform that connects users seeking repair services
          with independent third-party service providers (Technicians). FixGo
          itself does not provide repair services and is not responsible for the
          quality of work performed by Technicians.
        </Text>

        <Text style={styles.sectionTitle}>3. USER RESPONSIBILITIES</Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0"}You are responsible for maintaining the confidentiality of your
          account and password. You agree to provide accurate, current, and
          complete information during the registration process and to update such
          information to keep it accurate.
        </Text>

        <Text style={styles.sectionTitle}>4. LIMITATION OF LIABILITY</Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0"}In no event shall FixGo, nor its directors, employees, partners,
          agents, suppliers, or affiliates, be liable for any indirect,
          incidental, special, consequential, or punitive damages, including
          without limitation loss of profits, data, use, goodwill, or other
          intangible losses resulting from your use of the application.
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