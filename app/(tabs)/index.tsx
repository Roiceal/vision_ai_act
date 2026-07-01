import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">VisionAI</ThemedText>

      <ThemedText style={styles.subtitle}>
        Tap the button below to open the camera.
      </ThemedText>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/cameraScreen")}
      >
        <ThemedText style={styles.buttonText}>Open Camera</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  subtitle: {
    marginTop: 10,
    marginBottom: 30,
    textAlign: "center",
    fontSize: 16,
  },

  button: {
    backgroundColor: "#2E5BBA",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
