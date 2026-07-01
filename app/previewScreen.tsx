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
      <View style={styles.analysisRow}>
        <TouchableOpacity
          style={[styles.analysisButton, styles.academicButton]}
          onPress={() => handleAnalyze("academic")}
        >
          <Text style={styles.buttonText}>Academic</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.analysisButton, styles.safetyButton]}
          onPress={() => handleAnalyze("safety")}
        >
          <Text style={styles.buttonText}>Safety</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.analysisButton, styles.inventoryButton]}
          onPress={() => handleAnalyze("inventory")}
        >
          <Text style={styles.buttonText}>Inventory</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Retake</Text>
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
    paddingVertical: 20,
  },

  analysisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  retakeButton: {
    backgroundColor: "#252632",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },

  analysisButton: {
    flex: 1,
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },

  academicButton: {
    backgroundColor: "#6C63FF",
  },

  safetyButton: {
    backgroundColor: "#FF5E7A",
  },

  inventoryButton: {
    backgroundColor: "#1DD6AA",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
