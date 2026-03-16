import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { onSnapshot } from "firebase/firestore";
import { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
 const [userEmailDisplay, setUserEmailDisplay] = useState(""); 
  const [userPhoto, setUserPhoto] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const navigation = useNavigation<any>();

useFocusEffect(
  useCallback(() => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        setUserName(data.fullName || "User");
        setUserEmailDisplay(data.email || user.email || "");

        // ✅ Base64 Image Support
        if (data.photoBase64) {
          setUserPhoto(data.photoBase64);
        } else {
          setUserPhoto("");
        }

        // ✅ Verification Check Updated
        const requiredFields = [
          data.fullName,
          data.phone,
          data.gender,
          data.birthDate,
          data.photoBase64, // changed here
        ];

        const complete = requiredFields.every(
          (field) => field !== undefined && field !== ""
        );

        setIsVerified(complete);
      }
    });

    return () => unsubscribe();
  }, [])
);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("CustomerLogin");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const accountMenu = [
    {
      label: "Personal Information",
      icon: "person-outline",
      screen: "PersonalInformation",
    },
    { label: "Payment Methods", icon: "card-outline" },
  ];

  const supportMenu = [
    {
      label: "Help & Support",
      icon: "help-circle-outline",
      screen: "HelpSupport",
    },
    {
      label: "Privacy Policy",
      icon: "lock-closed-outline",
      screen: "PrivacyPolicy",
    },
    {
      label: "Terms of Service",
      icon: "document-text-outline",
      screen: "TermsOfService",
    },
    {
      label: "About FixGo",
      icon: "information-circle-outline",
      screen: "AboutFixGo",
    },
  ];

  const renderMenuSection = (
    title: string,
    items: { label: string; icon: string; screen?: string }[]
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.menu}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              index === items.length - 1 && { borderBottomWidth: 0 },
            ]}
            onPress={() => {
              if (item.screen) {
                navigation.navigate(item.screen);
              }
            }}
          >
            <View style={styles.menuRow}>
              <Ionicons
                name={item.icon as any}
                size={20}
                color="#6C63FF"
                style={{ marginRight: 15 }}
              />

              <Text style={styles.menuText}>{item.label}</Text>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#ccc"
                style={{ marginLeft: "auto" }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
  style={styles.container}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 60 }}
>
      
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("PersonalInformation")}>
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
</TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.address}>{userEmailDisplay}</Text>

          <View
            style={[
              styles.badge,
              { backgroundColor: isVerified ? "#E8F5E9" : "#df998e" },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: isVerified ? "#87b14f" : "#f33f3f" },
              ]}
            >
              {isVerified ? "Verified Customer" : "Unverified Customer"}
            </Text>
          </View>
        </View>
      </View>

      {/* Notification if incomplete */}
      {!isVerified && (
        <TouchableOpacity
          style={styles.alertBox}
          onPress={() => navigation.navigate("PersonalInformation")}
        >
          <Ionicons name="warning-outline" size={20} color="#ff9800" />
          <Text style={styles.alertText}>
            Complete your personal information to verify your account
          </Text>
        </TouchableOpacity>
      )}

      {/* Account */}
      {renderMenuSection("Account", accountMenu)}

      {/* Support */}
      {renderMenuSection("Support", supportMenu)}

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color="#ff4d4d" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    alignItems: "center",
    backgroundColor: "#4b465e",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },

  userInfo: {
    flex: 1,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  address: {
    color: "#ddd",
    marginVertical: 2,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },

  alertText: {
    marginLeft: 10,
    color: "#E65100",
    fontWeight: "500",
    flex: 1,
  },

  section: {
    marginBottom: 25,
  },

  avatarPlaceholder: {
  width: 80,
  height: 80,
  borderRadius: 40,
  marginRight: 15,
  borderWidth: 2,
  borderColor: "#fff",
  backgroundColor: "#eee",
  justifyContent: "center",
  alignItems: "center",
},

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    marginLeft: 5,
  },

  menu: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    fontSize: 16,
    color: "#333",
  },

  logoutContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,

  },

  logoutText: {
    color: "#ff4d4d",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
});