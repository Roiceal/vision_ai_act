import { router, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PreviewScreen() {
  // Get the photo URI from the camera screen
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();

  return (
    <View style={styles.container}>
      {/* Display the captured photo */}
      <Image
        source={{ uri: photoUri }}
        style={styles.preview}
        resizeMode="contain"
      />

      {/* Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={() =>
            router.push({
              pathname: "/resultScreen",
              params: {
                photoUri,
              },
            })
          }
        >
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  preview: {
    flex: 1,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },

  retakeButton: {
    backgroundColor: "#5A6472",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  analyzeButton: {
    backgroundColor: "#5B3FA3",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
