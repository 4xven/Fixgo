import React, { useState } from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { db, auth } from "../../../config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { doc, getDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

export default function BookingScreen({ route, navigation }: any) {
  const { serviceType } = route.params;

  const [phoneNumber, setPhoneNumber] = useState("");

const [date, setDate] = useState<Date | null>(null);
const [time, setTime] = useState<Date | null>(null);

  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<string | null>(null);

const [isDatePickerVisible, setDatePickerVisible] = useState(false);
const [isTimePickerVisible, setTimePickerVisible] = useState(false);

const [isVerified, setIsVerified] = useState(false);

useFocusEffect(
  React.useCallback(() => {
    const checkVerification = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const requiredFields = [
            data.fullName,
            data.phone,
            data.gender,
            data.birthDate,
          ];

          const complete = requiredFields.every(
            (field) => field !== undefined && field !== ""
          );

          setIsVerified(complete);
        }
      } catch (error) {
        console.log("Verification error:", error);
      }
    };

    checkVerification();
  }, [])
);

const handleConfirmBooking = async () => {
  const user = auth.currentUser;

  if (!user) {
    Alert.alert("Error", "You must be logged in.");
    return;
  }

  if (!isVerified) {
    Alert.alert(
      "Account Not Verified",
      "Please complete your personal information before booking.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete Now",
          onPress: () => navigation.navigate("PersonalInformation"),
        },
      ]
    );
    return;
  }

  if (!address) {
    Alert.alert("Missing Address", "Please enter your service address.");
    return;
  }

  if (!phoneNumber) {
    Alert.alert("Missing Phone", "Please enter your phone number.");
    return;
  }

  try {
    await addDoc(collection(db, "bookings"), {
      userId: user.uid, // ✅ IMPORTANT FIX
      serviceType,
      date: date ? date.toISOString() : null,
      time: time ? time.toISOString() : null,
      address,
      phoneNumber,
      notes,
      image: image || null,
      status: "pending",
      assignedTechnician: null,
      createdAt: serverTimestamp(),
    });

    Alert.alert("Success", "Booking confirmed!");
    navigation.goBack();
  } catch (error) {
    console.error("Error saving booking:", error);
    Alert.alert("Error", "Failed to save booking.");
  }
};

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "You need to allow access to photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };



const [region, setRegion] = useState({
  latitude: 14.6091,
  longitude: 121.0223,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
});

const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    alert("Location permission denied");
    return;
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const { latitude, longitude } = location.coords;

  // Move map to user location
  setRegion({
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Reverse geocode using Expo
  const reverseGeocode = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  if (reverseGeocode.length > 0) {
    const place = reverseGeocode[0];

    // Combine fields to get full, detailed address
    const fullAddress = `${
      place.streetNumber ? place.streetNumber + " " : ""
    }${place.street || ""}, ${
      place.subregion || place.district || ""
    }, ${place.city || ""}, ${place.region || ""}`;

    setAddress(fullAddress);
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a Service</Text>
        </View>

                {/* WARNING */}
{!isVerified && (
  <View style={styles.warningBox}>
    <Ionicons name="warning-outline" size={20} color="#ff9800" />
    <Text style={styles.warningText}>
      Your account is not verified. Complete your personal information before booking services.
    </Text>
  </View>
)}

        {/* Service Type */}
        <Text style={styles.label}>SERVICE TYPE</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputText}>{serviceType}</Text>
          <Ionicons name="briefcase-outline" size={20} color="#777" />
        </View>

      {/* Date Picker */}
<Text style={styles.label}>PREFERRED DATE</Text>
<TouchableOpacity
  style={styles.inputRow}
  onPress={() => setDatePickerVisible(true)}
>
  <Text
    style={{
      fontSize: 15,
      color: date ? "#000" : "#d1c1c1", // black if picked, placeholder color if null
    }}
  >
    {date ? date.toLocaleDateString() : "Select a date"}
  </Text>
  <Ionicons name="calendar-outline" size={20} color="#777" />
</TouchableOpacity>

{/* Time Picker */}
<Text style={styles.label}>PREFERRED TIME</Text>
<TouchableOpacity
  style={styles.inputRow}
  onPress={() => setTimePickerVisible(true)}
>
  <Text
    style={{
      fontSize: 15,
      color: time ? "#000" : "#d1c1c1", // black if picked, placeholder color if null
    }}
  >
    {time
      ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Select a time"}
  </Text>
  <Ionicons name="time-outline" size={20} color="#777" />
</TouchableOpacity>


{/* Phone Number */}
<Text style={styles.label}>PHONE NUMBER</Text>
<TextInput
  style={styles.input}
  placeholder="Enter your phone number..."
  placeholderTextColor="#d1c1c1"
  value={phoneNumber}
  onChangeText={(text) => {
    // Allow only digits and max 11 characters
    const filtered = text.replace(/[^0-9]/g, "");
    if (filtered.length <= 11) setPhoneNumber(filtered);
  }}
  keyboardType="phone-pad"
/>

        {/* Address */}
<Text style={styles.label}>SERVICE ADDRESS</Text>

<TextInput
  style={styles.input}
  placeholder="Enter your full address..."
  placeholderTextColor="#d1c1c1"
  value={address}
  onChangeText={setAddress}
/>

<Text style={styles.label}>OR SELECT LOCATION ON MAP</Text>

<MapView
  style={styles.map}
  region={region}
  onPress={async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    setRegion({
      ...region,
      latitude,
      longitude,
    });

    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (reverseGeocode.length > 0) {
      const place = reverseGeocode[0];

      const fullAddress = `${
        place.streetNumber ? place.streetNumber + " " : ""
      }${place.street || ""}, ${
        place.subregion || place.district || ""
      }, ${place.city || ""}, ${place.region || ""}`;

      setAddress(fullAddress);
    }
  }}
>
  <Marker coordinate={region} draggable />
</MapView>

{/* Place these at the end, just before closing KeyboardAvoidingView */}
<DateTimePickerModal
  isVisible={isDatePickerVisible}
  mode="date"
  onConfirm={(selectedDate) => {
    setDate(selectedDate);
    setDatePickerVisible(false);
  }}
  onCancel={() => setDatePickerVisible(false)}
/>

<DateTimePickerModal
  isVisible={isTimePickerVisible}
  mode="time"
  is24Hour={false}
  onConfirm={(selectedTime) => {
    setTime(selectedTime);
    setTimePickerVisible(false);
  }}
  onCancel={() => setTimePickerVisible(false)}
/>

<TouchableOpacity style={styles.gpsBtn} onPress={getCurrentLocation}>
  <Ionicons name="locate" size={20} color="#fff" />
  <Text style={{ color: "#fff", marginLeft: 5 }}>Use My Location</Text>
</TouchableOpacity>

        {/* Notes */}
        <Text style={styles.label}>ADDITIONAL NOTES (OPTIONAL)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Describe the issue in detail..."
          placeholderTextColor="#d1c1c1"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {/* Image Upload */}
        <Text style={styles.label}>UPLOAD IMAGE (OPTIONAL)</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={24} color="#777" />
              <Text style={{ color: "#777", marginTop: 5 }}>Add Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
  style={[
    styles.button,
    { backgroundColor: isVerified ? "#4b465e" : "#ccc" }
  ]}
  onPress={handleConfirmBooking}
>
  <Text style={styles.buttonText}>
    {isVerified ? "Confirm Booking" : "Verification Required"}
  </Text>
</TouchableOpacity>
      </ScrollView>
      {!isVerified && (
  <View style={styles.verificationOverlay}>
    <Ionicons name="shield-checkmark-outline" size={60} color="#4b465e" />

    <Text style={styles.verificationTitle}>
      Account Verification Required
    </Text>

    <Text style={styles.verificationText}>
      You must complete your personal information before booking a service.
    </Text>

    <TouchableOpacity
  style={styles.verifyButton}
  onPress={() =>
    navigation.navigate("SplashScreen", {
      nextScreen: "PersonalInformation",
    })
  }
>
  <Text style={styles.verifyButtonText}>Verify Now</Text>
</TouchableOpacity>
  </View>
)}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F6F7FB", paddingTop: 65, },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backBtn: { paddingRight: 10 },
  headerTitle: { fontSize:24, fontWeight: "700" },
  label: { fontSize: 12, color: "#777", marginTop: 15 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 15, marginTop: 5 },
  inputRow: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: { fontSize: 16, color: "#000000" },
  inputloc: { fontSize: 15, color: "#d1c1c1" },
  button: {
    backgroundColor: "#4b465e",
    marginTop: 25,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  imagePicker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 150,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: { justifyContent: "center", alignItems: "center" },
  imagePreview: { width: "100%", height: "100%", borderRadius: 10 },
  addressContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 5,
},

addressInput: {
  flex: 1,
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 15,
},

map: {
  width: "100%",
  height: 200,
  borderRadius: 10,
  marginTop: 10,
},

gpsBtn: {
  flexDirection: "row",
  backgroundColor: "#4b465e",
  padding: 10,
  marginTop: 10,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
},

warningBox: {
  flexDirection: "row",
  backgroundColor: "#FFF3E0",
  padding: 12,
  borderRadius: 10,
  marginBottom: 15,
  alignItems: "center",
},

warningText: {
  marginLeft: 10,
  color: "#E65100",
  flex: 1,
  fontSize: 13,
},

noticeBox: {
  flexDirection: "row",
  backgroundColor: "#FFF3CD",
  borderColor: "#FFE69C",
  borderWidth: 1,
  padding: 10,
  borderRadius: 10,
  alignItems: "center",
  marginBottom: 15,
},

noticeText: {
  marginLeft: 6,
  fontSize: 13,
  color: "#856404",
  flex: 1,
},


verificationOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255,255,255,0.95)",
  justifyContent: "center",
  alignItems: "center",
  padding: 30,
},

verificationTitle: {
  fontSize: 20,
  fontWeight: "700",
  marginTop: 15,
},

verificationText: {
  textAlign: "center",
  marginTop: 10,
  color: "#555",
  fontSize: 14,
},

verifyButton: {
  backgroundColor: "#4b465e",
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 10,
  marginTop: 20,
},

verifyButtonText: {
  color: "#fff",
  fontWeight: "700",
},
});