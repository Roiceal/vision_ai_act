import { router, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { imageToBase64 } from "../lib/gemini";

export default function PreviewScreen() {
  const params = useLocalSearchParams();

  // ✅ safely extract photoUri
  const photoUri =
    typeof params.photoUri === "string"
      ? params.photoUri
      : Array.isArray(params.photoUri)
        ? params.photoUri[0]
        : null;

  // 🚀 ANALYZE FUNCTION (CRASH-PROOF VERSION)
  async function handleAnalyze(promptKey: "academic" | "safety" | "inventory") {
    console.log("🔥 ANALYZE CLICKED", promptKey);

    try {
      console.log("📦 params:", params);
      console.log("📸 photoUri:", photoUri);

      if (!photoUri || typeof photoUri !== "string") {
        console.log("❌ Invalid photoUri");
        return;
      }

      console.log("⏳ Converting image to base64...");
      const base64Image = await imageToBase64(photoUri);

      console.log("🚀 Navigating to resultScreen with promptKey...", promptKey);
      router.push({
        pathname: "/resultScreen",
        params: {
          base64Image,
          promptKey,
        },
      });

      console.log("🎯 Navigation triggered");
    } catch (error) {
      console.log("❌ HANDLE ANALYZE ERROR:", error);
    }
  }

  return (
    <View style={styles.container}>
      {/* IMAGE PREVIEW */}
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={styles.preview}
          resizeMode="contain"
        />
      ) : (
        <Text style={{ color: "white" }}>No image found</Text>
      )}

      {/* BUTTONS */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.analysisRow}>
        <TouchableOpacity
          style={styles.analysisButton}
          onPress={() => handleAnalyze("academic")}
        >
          <Text style={styles.buttonText}>Academic Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.analysisButton}
          onPress={() => handleAnalyze("safety")}
        >
          <Text style={styles.buttonText}>Safety Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.analysisButton}
          onPress={() => handleAnalyze("inventory")}
        >
          <Text style={styles.buttonText}>Inventory Analysis</Text>
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
    width: "100%",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },

  analysisRow: {
    flexDirection: "column",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  retakeButton: {
    backgroundColor: "#5A6472",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  analysisButton: {
    backgroundColor: "#4E7CFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
