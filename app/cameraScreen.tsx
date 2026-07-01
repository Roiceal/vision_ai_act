import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  // Camera permission
  const [permission, requestPermission] = useCameraPermissions();

  // Camera reference
  const cameraRef = useRef<CameraView | null>(null);

  // Store the photo URI
  const [photo, setPhoto] = useState<string | null>(null);

  // Take a picture
  async function takePicture() {
    if (!cameraRef.current) return;

    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.3,
      });

      console.log("Photo URI:", result.uri);

      setPhoto(result.uri);

      // Navigate to Preview Screen
      router.push({
        pathname: "/previewScreen",
        params: {
          photoUri: result.uri,
        },
      });
    } catch (error) {
      console.log("Error taking picture:", error);
    }
  }

  // Loading permission
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Camera Screen
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.captureButtonText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#2E5BBA",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
  },

  captureButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  permissionText: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
  },

  permissionButton: {
    backgroundColor: "#2E5BBA",
    padding: 12,
    borderRadius: 8,
  },

  permissionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
