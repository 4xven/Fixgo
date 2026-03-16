import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HelpSupport() {

  const navigation = useNavigation<any>();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I book a service?",
      answer:
        " Go to the Home screen, choose the repair category you need, select a technician, choose a time slot, and confirm your booking."
    },
    {
      question: "How do I cancel a booking?",
      answer:
        "Open the Bookings tab, select the service you scheduled, and tap Cancel Booking before the technician arrives."
    },
    {
      question: "How are technicians verified?",
      answer:
        "All technicians go through a verification process that includes ID validation and skill verification before being allowed to provide services."
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "Payment is based on the service rendered. Currently, payments are CASH ONLY and are paid directly to the service provider once the customer and technician meet and the service is completed."
    },
    {
      question: "When do I pay for the service?",
      answer:
        "You only pay after the technician arrives and completes the requested service. Payment is made directly to the technician."
    },
    {
      question: "What if the technician does not arrive?",
      answer:
        "If the technician does not arrive at the scheduled time, you may cancel the booking and choose another available technician."
    },
    {
      question: "Can I reschedule my booking?",
      answer:
        "Yes. You can reschedule by opening your booking details and selecting a new available time slot."
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact support through Live Chat, Call Us, or Email from the Help & Support page."
    },
    {
      question: "Is my location shared with technicians?",
      answer:
        "Yes. Your location is shared only with the technician you booked so they can find your service location."
    }
  ];

  return (
    <ScrollView style={styles.container}>

<View style={styles.header}>
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={styles.backBtn}
  >
    <Ionicons name="arrow-back" size={24} color="#000" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Help & Support</Text>
</View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search for help..."
          style={styles.searchInput}
        />
      </View>

      {/* FAQ */}
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqBox}>
          <TouchableOpacity
            style={styles.faqHeader}
            onPress={() => toggleFAQ(index)}
          >
            <Text style={styles.question}>{faq.question}</Text>
            <Ionicons
              name={activeIndex === index ? "chevron-up" : "chevron-down"}
              size={18}
              color="#555"
            />
          </TouchableOpacity>

          {activeIndex === index && (
            <Text style={styles.answer}>{faq.answer}</Text>
          )}
        </View>
      ))}

      {/* Contact */}
      <Text style={styles.sectionTitle}>Contact Us</Text>

      <View style={styles.contactRow}>

        <TouchableOpacity style={styles.contactCard}>
          <Ionicons name="chatbubble-outline" size={28} color="#4F46E5" />
          <Text style={styles.contactText}>Live Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard}>
          <Ionicons name="call-outline" size={28} color="#4F46E5" />
          <Text style={styles.contactText}>Call Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard}>
          <Ionicons name="mail-outline" size={28} color="#4F46E5" />
          <Text style={styles.contactText}>Email</Text>
        </TouchableOpacity>

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

title: {
  fontSize: 22,
  fontWeight: "bold",
  textAlign: "center",
  flex: 1,
},

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20
  },

  searchInput: {
    flex: 1,
    padding: 10
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10
  },

  faqBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    padding: 15
  },

  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  question: {
    fontWeight: "600",
    fontSize: 16,
    flex: 1,
    paddingRight: 10
  },

answer: {
  marginTop: 10,
  color: "#555",
  fontSize: 14,
  lineHeight: 18,
  textAlign: "justify",
},


  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },

  contactCard: {
    backgroundColor: "#fff",
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 10,
    alignItems: "center"
  },

  contactText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "500",
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

});