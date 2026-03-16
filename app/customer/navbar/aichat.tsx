// app/customer/navbar/aichat.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { auth, db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc  } from "firebase/firestore";

// Message type
type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

// Booking type from Firebase
type Booking = {
  id: string;
  serviceType: string;
  date: string; // ISO string
  time: string; // ISO string
  address: string;
  phoneNumber: string;
  notes?: string;
  image?: string;
  status: string;
};

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Hello! I am FixGo AI. Ask me anything about our system or type 'My bookings' to see your bookings.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

 const API_KEY = "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";

  const systemPrompt = `
You are FixGo AI assistant.

Help users understand the FixGo system.

System Pages:
Login - Access your account. Users can choose Customer or Provider login.
Register -Create a new account as Customer or Provider.
Home -
Book
Profile
About Us
Help & Support
Terms & Conditions
Privacy Policy

Booking System:
- Users can book a service with date, time, address, phone, notes, and optional image.
- Bookings are stored in Firebase 'bookings' collection.
- You can fetch a user's bookings by their UID.
- You should guide users on how to view, cancel, or modify bookings.

Always give simple helpful answers.
`;

  // Scroll to bottom on new messages
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Fetch user bookings from Firebase
  const fetchUserBookings = async (): Promise<Booking[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);

      const bookings: Booking[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Booking, "id">;
        return { id: doc.id, ...data };
      });

      return bookings;
    } catch (err) {
      console.error("Error fetching bookings:", err);
      return [];
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      role: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Handle "my bookings" locally
      if (input.toLowerCase().includes("my bookings")) {
        const bookings = await fetchUserBookings();
        const aiReply = bookings.length
          ? bookings
              .map(
                (b, i) =>
                  `${i + 1}. ${b.serviceType} on ${new Date(b.date).toLocaleDateString()} at ${new Date(
                    b.time
                  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, status: ${b.status}`
              )
              .join("\n")
          : "You have no bookings yet.";
        setMessages((prev) => [...prev, { id: `${Date.now()}`, role: "ai", text: aiReply }]);
        setLoading(false);
        return;

      }
if (input.toLowerCase().includes("my name") || input.toLowerCase().includes("profile")) {
  const user = auth.currentUser;
  if (!user) {
    setMessages(prev => [...prev, { id: `${Date.now()}`, role: "ai", text: "You are not logged in." }]);
    setLoading(false);
    return;
  }

  const docRef = doc(db, "users", user.uid);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    setMessages(prev => [...prev, { id: `${Date.now()}`, role: "ai", text: "No profile info found." }]);
    setLoading(false);
    return;
  }

  const data = snap.data();
  setMessages(prev => [...prev, { 
    id: `${Date.now()}`, 
    role: "ai", 
    text: `Your name is ${data.fullName || "not set"}.` 
  }]);
  setLoading(false);
  return;
}
      

      // Send to Groq API
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "openai/gpt-oss-120b", // ✅ Updated model
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input },
          ],
          max_tokens: 250,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const aiReply = response?.data?.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";
      setMessages((prev) => [...prev, { id: `${Date.now()}`, role: "ai", text: aiReply }]);
    } catch (error: any) {
      console.error("AI ERROR:", error.response?.data || error.message);
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}`, role: "ai", text: "Error: AI model unavailable. Please try again later." },
      ]);
    }

    setLoading(false);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.message, item.role === "user" ? styles.userMessage : styles.aiMessage]}>
      <Text style={[styles.messageText, { color: item.role === "user" ? "#fff" : "#000" }]}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.aiIcon}>
              <Text style={{ color: "#6A5AE0", fontWeight: "bold", fontSize: 25 }}>✦</Text>
            </View>
            <View>
              <Text style={styles.title}>FixGo AI Assistant</Text>
              <View style={styles.statusRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.statusText}>Online</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chat List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15, paddingBottom: 30 }}
        />

        {/* Loading */}
        {loading && <ActivityIndicator size="small" style={{ marginBottom: 10 }} />}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask FixGo AI..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={{ color: "#fff", fontSize: 16 }}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 45 },
  header: { backgroundColor: "#fff", paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: "#eee" },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  aiIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F0EEFF", justifyContent: "center", alignItems: "center", marginRight: 10 },
  title: { fontSize: 18, fontWeight: "600" },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "green", marginRight: 5 },
  statusText: { fontSize: 12, color: "green" },
  message: { padding: 12, borderRadius: 10, marginVertical: 5, maxWidth: "80%" },
  userMessage: { backgroundColor: "#6A5AE0", alignSelf: "flex-end" },
  aiMessage: { backgroundColor: "#E5E5EA", alignSelf: "flex-start" },
  messageText: { fontSize: 15 },
  inputContainer: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#fff" },
  input: { flex: 1, padding: 10, backgroundColor: "#F1F1F1", borderRadius: 8 },
  sendBtn: { marginLeft: 10, backgroundColor: "#6A5AE0", paddingHorizontal: 15, justifyContent: "center", borderRadius: 8 },
});