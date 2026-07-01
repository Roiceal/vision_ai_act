import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ResultScreen() {
  // Get the photo URI from the Preview Screen
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result Screen</Text>

      <Text style={styles.subtitle}>
        This screen will be completed in Phase 5.
      </Text>

      <Text style={styles.label}>Photo URI:</Text>

      <Text style={styles.uri}>{photoUri}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
  },

  uri: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
});
