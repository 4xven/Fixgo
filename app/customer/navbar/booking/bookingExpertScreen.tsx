
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

import { auth, db } from "../../../config/firebaseConfig";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function BookingExpertScreen({ route, navigation }: any) {
  const { expert } = route.params;

  const [selectedService, setSelectedService] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [isVerified, setIsVerified] = useState(false);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const [region, setRegion] = useState({
    latitude: 14.6091,
    longitude: 121.0223,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // CHECK USER VERIFICATION
useEffect(() => {
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

      setVerificationLoading(false);
    } catch (error) {
      console.log("Verification error:", error);
      setVerificationLoading(false);
    }
  };

  checkVerification();
}, []);

  // CONFIRM BOOKING
  const handleConfirmBooking = async () => {
    const user = auth.currentUser;
    if (verificationLoading) {
  Alert.alert("Please wait", "Checking account verification...");
  return;
}

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

    if (!selectedService || !address || !phoneNumber || !date || !time) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        expertId: expert.id,
        expertName: expert.fullName,
        serviceType: selectedService,
        date: date.toISOString(),
        time: time.toISOString(),
        address,
        phoneNumber,
        notes,
        image: image || null,
        status: "pending",
        assignedTechnician: expert.id,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Booking confirmed!");
      navigation.goBack();
    } catch (error) {
      console.log("Booking error:", error);
      Alert.alert("Error", "Failed to confirm booking.");
    }
  };

  // IMAGE PICKER
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

  // GET GPS LOCATION
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
      }${place.street || ""}, ${place.city || ""}, ${place.region || ""}`;

      setAddress(fullAddress);
    }
  };

  const [verificationLoading, setVerificationLoading] = useState(true);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a Service</Text>
        </View>


        {/* EXPERT CARD */}
        {/* BOOKING NOTICE */}
<TouchableOpacity
  style={styles.noticeBox}
  onPress={() =>
    navigation.navigate("SplashScreen", { nextScreen: "Profile" })
  }
>
  <Ionicons name="information-circle-outline" size={18} color="#856404" />
  <Text style={styles.noticeText}>
    Please make sure your booking details are correct before confirming.
  </Text>
</TouchableOpacity>


        <View style={styles.expertCard}>
          <View style={styles.avatar}>
            {expert.avatar ? (
              <Image source={{ uri: expert.avatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="person" size={40} color="#fff" />
            )}
          </View>

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.expertLabel}>BOOKING WITH EXPERT</Text>
            <Text style={styles.expertName}>{expert.fullName}</Text>
          </View>
        </View>

        {/* SERVICE TYPE */}
        <Text style={styles.label}>SERVICE TYPE</Text>

        <View style={styles.servicesContainer}>
          {expert.service?.map((s: string) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.serviceOption,
                selectedService === s && styles.serviceOptionSelected,
              ]}
              onPress={() => setSelectedService(s)}
            >
              <Text
                style={[
                  styles.serviceOptionText,
                  selectedService === s && styles.serviceOptionTextSelected,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DATE */}
        <Text style={styles.label}>PREFERRED DATE</Text>
<TouchableOpacity
  style={styles.inputRow}
  onPress={() => setDatePickerVisible(true)}
>
  <Text
    style={{
      fontSize: 15,
      color: date ? "#000" : "#d1c1c1",
    }}
  >
    {date ? date.toLocaleDateString() : "Select a date"}
  </Text>

  <Ionicons name="calendar-outline" size={20} color="#777" />
</TouchableOpacity>

        {/* TIME */}
        <Text style={styles.label}>PREFERRED TIME</Text>
<TouchableOpacity
  style={styles.inputRow}
  onPress={() => setTimePickerVisible(true)}
>
  <Text
    style={{
      fontSize: 15,
      color: time ? "#000" : "#d1c1c1",
    }}
  >
    {time
      ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Select a time"}
  </Text>

  <Ionicons name="time-outline" size={20} color="#777" />
</TouchableOpacity>

        {/* PHONE */}
        <Text style={styles.label}>PHONE NUMBER</Text>

        <TextInput
  style={styles.input}
  placeholder="Enter your phone number..."
  placeholderTextColor="#d1c1c1"
  value={phoneNumber}
          onChangeText={(text) => {
            const filtered = text.replace(/[^0-9]/g, "");
            if (filtered.length <= 11) setPhoneNumber(filtered);
          }}
          keyboardType="phone-pad"
        />

        {/* ADDRESS */}
        <Text style={styles.label}>SERVICE ADDRESS</Text>

        <TextInput
  style={styles.input}
  placeholder="Enter your full address..."
  placeholderTextColor="#d1c1c1"
  value={address}
          onChangeText={setAddress}
        />

        <MapView
          style={styles.map}
          region={region}
          onPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setRegion({ ...region, latitude, longitude });
          }}
        >
          <Marker coordinate={region} draggable />
        </MapView>

        <TouchableOpacity style={styles.gpsBtn} onPress={getCurrentLocation}>
          <Ionicons name="locate" size={20} color="#fff" />
          <Text style={{ color: "#fff", marginLeft: 5 }}>Use My Location</Text>
        </TouchableOpacity>

        {/* NOTES */}
        <Text style={styles.label}>NOTES (OPTIONAL)</Text>

        <TextInput
  style={[styles.input, { height: 80 }]}
  placeholder="Describe the issue in detail..."
  placeholderTextColor="#d1c1c1"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {/* IMAGE */}
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

        {/* CONFIRM BUTTON */}
        <TouchableOpacity
          style={[
  styles.button,
  { backgroundColor: isVerified && !verificationLoading ? "#4b465e" : "#ccc" }
]}
          onPress={handleConfirmBooking}
        >
          <Text style={styles.buttonText}>
            {isVerified ? "Confirm Booking" : "Verification Required"}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* DATE PICKER */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(selectedDate) => {
          setDate(selectedDate);
          setDatePickerVisible(false);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />

      {/* TIME PICKER */}
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

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F6F7FB", paddingTop: 65 },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: "700", marginLeft: 10 },

  expertCard: {
    flexDirection: "row",
    backgroundColor: "#E8EBFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4b465e",
    justifyContent: "center",
    alignItems: "center",
  },

  expertLabel: { fontSize: 12, fontWeight: "700", color: "#4b465e" },
  expertName: { fontSize: 16, fontWeight: "700" },

  label: { fontSize: 12, color: "#777", marginTop: 15 },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 5,
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

  imagePicker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 150,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },

    imagePlaceholder: { justifyContent: "center", alignItems: "center" },

  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  button: {
    marginTop: 25,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: { color: "#fff", fontWeight: "700" },

  servicesContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 5 },

  serviceOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  serviceOptionSelected: {
    backgroundColor: "#6B63FF",
    borderColor: "#6B63FF",
  },

  serviceOptionText: { fontSize: 14, color: "#777" },

  serviceOptionTextSelected: {
    color: "#fff",
    fontWeight: "700",
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

  inputRow: {
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 15,
  marginTop: 5,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
});

