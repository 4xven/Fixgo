import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AboutFixGo() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About FixGo</Text>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/img/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          FixGo is your trusted mobile platform for finding reliable repair
          technicians for your smartphones, gadgets, and home appliances. We
          connect you with verified professionals in your area using real-time GPS
          technology.
        </Text>


        <TouchableOpacity style={styles.actionButton}>
          <Entypo name="share" size={20} color="#5A5AFF" />
          <Text style={styles.actionText}>Share App with Friends</Text>
        </TouchableOpacity>

        {/* Follow */}

        <Text style={styles.follow}>FOLLOW US</Text>

        <View style={styles.socialRow}>
          <View style={styles.socialBtn}>
            <FontAwesome name="facebook" size={20} color="#444" />
          </View>

          <View style={styles.socialBtn}>
            <FontAwesome name="twitter" size={20} color="#444" />
          </View>

          <View style={styles.socialBtn}>
            <FontAwesome name="instagram" size={20} color="#444" />
          </View>
        </View>
      </ScrollView>

      {/* Footer - fixed at bottom */}
      <Text style={styles.footer}>
        © 2025 FixGo Technologies Inc.{"\n"}All rights reserved.
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 20,
    paddingTop: 65,
     justifyContent: "space-between",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 10,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",

  },

  appName: {
    fontSize: 28,
    fontWeight: "700",
  },

  version: {
    fontSize: 15,
    color: "#5A5AFF",
    fontWeight: "600",
  },

  description: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },

  actionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },

  follow: {
    textAlign: "center",
    marginTop: 25,
    marginBottom: 15,
    color: "#9AA0A6",
    fontWeight: "700",
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 25,
  },

  socialBtn: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  footer: {
    textAlign: "center",
    color: "#9AA0A6",
    fontSize: 13,
  },
});