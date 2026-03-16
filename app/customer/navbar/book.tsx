import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../../config/firebaseConfig";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";

export default function Book() {
  type Booking = {
    id: string;
    serviceType: string;
    date: string;
    time: string;
    address: string;
    phoneNumber?: string;
    notes?: string;
    image?: string;
    status: string;
    assignedTechnician?: string; // providerId
    createdAt?: { seconds: number; nanoseconds: number };
    userId?: string;
  };

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "cancelled">("active");

  const [providersMap, setProvidersMap] = useState<Record<string, string>>({});

  // Fetch providers map
  useEffect(() => {
    const fetchProviders = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const map: Record<string, string> = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.userType === "Provider") {
          map[doc.id] = data.fullName; // providerId => name
        }
      });
      setProvidersMap(map);
    };
    fetchProviders();
  }, []);

  // Fetch bookings for current user only
useEffect(() => {
  const fetchBookings = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);

      const bookingsData: Booking[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Booking[];

      setBookings(bookingsData);

    } catch (error) {
      console.log("Error fetching bookings:", error);
    }
  };

  fetchBookings();
}, []);

  const toggleExpand = (id: string) => {
    setExpandedBookingId(expandedBookingId === id ? null : id);
  };

  const cancelBooking = async (item: Booking) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const bookingRef = doc(db, "bookings", item.id);
              await updateDoc(bookingRef, { status: "cancelled" });
              setBookings((prev) =>
                prev.map((b) => (b.id === item.id ? { ...b, status: "cancelled" } : b))
              );
              setActiveTab("cancelled");
            } catch (error) {
              console.log("Error cancelling booking:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderCard = (item: Booking) => {
    const createdAtDate = item.createdAt ? new Date(item.createdAt.seconds * 1000) : null;
    const scheduledDate = new Date(item.date);
    const scheduledTime = new Date(item.time);

    return (
      <View key={item.id} style={styles.card}>
        <Text style={styles.cardLabel}>CURRENT BOOKING</Text>

        {/* Service + Status */}
        <View style={[styles.row, { justifyContent: "space-between", alignItems: "center", marginTop: 10 }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="construct-outline" size={18} color="#6B63FF" />
            <Text style={styles.service}>{item.serviceType}</Text>
          </View>

          {item.status === "pending" || item.status === "confirmed" ? (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => cancelBooking(item)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          ) : item.status === "completed" ? (
            <View style={[styles.cancelBtn, { backgroundColor: "#4BB543" }]}>
              <Text style={styles.cancelBtnText}>Completed</Text>
            </View>
          ) : item.status === "cancelled" ? (
            <View style={[styles.cancelBtn, { backgroundColor: "#888" }]}>
              <Text style={styles.cancelBtnText}>Cancelled</Text>
            </View>
          ) : null}
        </View>

        {/* Assigned Technician */}
        <Text style={styles.tech}>
          Assigned Technician: {item.assignedTechnician ? providersMap[item.assignedTechnician] || "Pending..." : "Pending..."}
        </Text>

        {/* Expandable Details */}
        {expandedBookingId === item.id && (
          <View style={styles.detailsContainer}>
            {createdAtDate && (
              <>
                <Text style={styles.detailLabel}>Booked On:</Text>
                <Text style={styles.detailText}>{createdAtDate.toLocaleDateString()}</Text>
              </>
            )}
            {item.phoneNumber && (
              <>
                <Text style={styles.detailLabel}>Phone Number:</Text>
                <Text style={styles.detailText}>{item.phoneNumber}</Text>
              </>
            )}
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailText}>{item.address}</Text>
            {item.notes && (
              <>
                <Text style={styles.detailLabel}>Notes:</Text>
                <Text style={styles.detailText}>{item.notes}</Text>
              </>
            )}
            {item.image && (
              <>
                <Text style={styles.detailLabel}>Image:</Text>
                <Image source={{ uri: item.image }} style={styles.detailImage} />
              </>
            )}
          </View>
        )}

        {/* Scheduled Date/Time + Expand */}
        <View style={styles.scheduleRow}>
          <View>
            <Text style={styles.schedule}>Scheduled Date: {scheduledDate.toLocaleDateString()}</Text>
            <Text style={styles.schedule}>
              Scheduled Time: {scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <Text style={styles.details}>{expandedBookingId === item.id ? "Hide Details" : "View Details"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const activeBookings = bookings.filter((b) => b.status === "pending" || b.status === "confirmed");
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  const getData = () => {
    if (activeTab === "active") return activeBookings;
    if (activeTab === "completed") return completedBookings;
    return cancelledBookings;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab("active")}>
          <Text style={[styles.tab, activeTab === "active" && styles.activeTab]}>
            Active ({activeBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("completed")}>
          <Text style={[styles.tab, activeTab === "completed" && styles.activeTab]}>
            Completed ({completedBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("cancelled")}>
          <Text style={[styles.tab, activeTab === "cancelled" && styles.activeTab]}>
            Cancelled ({cancelledBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {getData().map((item) => renderCard(item))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 20, paddingTop: 65 },
  title: { fontSize: 30, fontWeight: "700", marginBottom: 15 },
  tabs: { marginTop: 20, flexDirection: "row", marginBottom: 35, justifyContent: "center" },
  tab: { marginRight: 20, color: "#888", fontWeight: "700", fontSize: 15 },
  activeTab: { color: "#6B63FF", borderBottomWidth: 2, borderBottomColor: "#6B63FF" },
  card: { backgroundColor: "#fff", borderRadius: 15, padding: 15, marginBottom: 15 },
  cardLabel: { fontSize: 11, color: "#aaa" },
  row: { flexDirection: "row", alignItems: "center" },
  service: { fontSize: 16, fontWeight: "600", marginLeft: 8 },
  tech: { marginTop: 5, color: "#555" },
  schedule: { marginTop: 5, color: "#777" },
  scheduleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  details: { color: "#6B63FF", fontWeight: "800", marginTop: 25 },
  detailsContainer: { marginTop: 10, padding: 10, backgroundColor: "#F0F0F0", borderRadius: 10 },
  detailLabel: { fontWeight: "700", marginTop: 5 },
  detailText: { color: "#555", marginTop: 2 },
  detailImage: { width: "100%", height: 200, borderRadius: 10, marginTop: 5 },
  cancelBtn: { alignSelf: "flex-end", backgroundColor: "#FF5A5F", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  cancelBtnText: { color: "#fff", fontWeight: "700" },
});