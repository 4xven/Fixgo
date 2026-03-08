import { View, Text, StyleSheet } from "react-native";

export default function Book() {
  return (
    <View style={styles.container}>
      <Text>Booking Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                // take full height
    justifyContent: "center", // vertical center
    alignItems: "center",     // horizontal center
  },
});