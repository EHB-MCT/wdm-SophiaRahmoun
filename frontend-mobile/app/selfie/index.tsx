import { useCameraPermissions, CameraView } from "expo-camera";
import { useState, useRef } from "react";
import { Button, View, Image, StyleSheet, Text } from "react-native";


export default function SelfieScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>La caméra est bloquée</Text>
        <Button title="Autoriser l’accès" onPress={requestPermission} />
      </View>
    );
  }

  async function takePhoto() {
    try {
      const camera = cameraRef.current;
      if (!camera) return;

      const photoData = await camera.takePictureAsync({
        quality: 1,
        base64: true,
      });

      setPhoto(photoData.uri);

      console.log("PHOTO URI:", photoData.uri);
      console.log("PHOTO BASE64 length:", photoData.base64?.length);

    } catch (err) {
      console.error("Erreur lors de la capture:", err);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {!photo ? (
        <>
          <CameraView
            ref={cameraRef}
            facing="front"
            style={{ flex: 1 }}
          />

          <Button title="📸 Prendre une photo" onPress={takePhoto} />
        </>
      ) : (
        <>
          <Image source={{ uri: photo }} style={styles.img} />

          <Button title="↩️ Reprendre" onPress={() => setPhoto(null)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});