import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { auth, db } from "../../../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function PersonalInformation() {
  const navigation = useNavigation<any>();
  const user = auth.currentUser;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [photo, setPhoto] = useState(""); // now stores base64
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // FETCH USER DATA
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();

          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setGender(data.gender || "");
          setPhoto(data.photoBase64 || ""); // 🔥 base64 now

          if (data.birthDate) {
            setBirthDate(new Date(data.birthDate));
          }
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // PICK IMAGE (BASE64)
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission required", "Please allow photo access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
       mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.5,
        base64: true, // 🔥 IMPORTANT
      });

      if (!result.canceled && result.assets.length > 0) {
        const base64 = result.assets[0].base64;

        if (!base64) {
          Alert.alert("Error", "Failed to read image.");
          return;
        }

        setPhoto(base64); // store base64
      }
    } catch (error) {
      console.log("Image picker error:", error);
    }
  };

  // SAVE PROFILE (FIRESTORE ONLY)
  const saveChanges = async () => {
    if (!user) return;

    if (!fullName.trim())
      return Alert.alert("Validation", "Please enter your full name");

    if (!phone || phone.length < 11)
      return Alert.alert("Validation", "Enter a valid phone number");

    if (!gender.trim())
      return Alert.alert("Validation", "Enter your gender");

    if (!birthDate)
      return Alert.alert("Validation", "Select your birth date");

    if (!photo)
      return Alert.alert("Validation", "Upload a profile photo");

    setLoading(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        fullName,
        phone,
        gender,
        birthDate: birthDate.toISOString(),
        photoBase64: photo, // 🔥 save base64
      });

      Alert.alert("Success", "Profile Updated!");
      navigation.goBack();
    } catch (error) {
      console.log("Save error:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = fullName && phone && gender && birthDate && photo;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Personal Information</Text>
        </View>

        {/* PROFILE IMAGE */}
        <View style={styles.imageContainer}>
          {photo ? (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${photo}`,
              }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={60} color="#888" />
            </View>
          )}

          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhoto}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* FULL NAME */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />

        {/* EMAIL */}
        <Text style={styles.label}>Email</Text>
        <TextInput value={email} editable={false} style={styles.input} />

        {/* PHONE */}
        <Text style={styles.label}>Phone</Text>
        <TextInput
          value={phone}
          keyboardType="phone-pad"
          onChangeText={(text) => {
            const filtered = text.replace(/[^0-9]/g, "");
            if (filtered.length <= 11) setPhone(filtered);
          }}
          style={styles.input}
        />

        {/* GENDER */}
        <Text style={styles.label}>Gender</Text>
        <TextInput
          value={gender}
          onChangeText={setGender}
          style={styles.input}
        />

        {/* BIRTHDATE */}
        <Text style={styles.label}>Birth Date</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text>
            {birthDate ? birthDate.toLocaleDateString() : "Select Date"}
          </Text>
          <Ionicons name="calendar-outline" size={20} />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setBirthDate(date);
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
        />

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isFormComplete && !loading ? "#4b465e" : "#ccc" },
          ]}
          disabled={!isFormComplete || loading}
          onPress={saveChanges}
        >
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 20,
    paddingTop: 65,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  changePhoto: {
    color: "#5a4cff",
    marginTop: 10,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  inputRow: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    marginTop: 30,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});