import { View, Text, StyleSheet } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text>Profile Page</Text>
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