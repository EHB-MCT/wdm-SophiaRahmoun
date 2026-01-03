import React, { useState, useRef, useEffect } from "react";
import React, { useState, useRef, useEffect } from "react";
import { useCameraPermissions, CameraView } from "expo-camera";
import {
	View,
	Image,
	StyleSheet,
	Text,
	ScrollView,
	ActivityIndicator,
	Button,
	Alert,
	Platform,
	Dimensions,
	Animated,
	Easing,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { getApiUrl, getBaseUrl, getDebugInfo } from "../../config/network";

const { width, height } = Dimensions.get("window");

interface AnalysisResult {
	faceDetected: boolean;
	estimatedAge?: number;
	gender?: string;
	dominantEmotion?: string;
	brightness: number;
	backgroundClutter: number;
	deviceInfo?: {
		platform?: string;
		appVersion?: string;
		timestamp?: string;
		ip?: string;
		userAgent?: string;
		locationHint?: {
			country?: string;
		};
	};
	id?: string;
}
type UiMode = "neutral" | "fun" | "serious";

export default function SelfieScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const [photo, setPhoto] = useState<string | null>(null);
	const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [uid, setUid] = useState<string | null>(null);
	const [retakeLockedUntil, setRetakeLockedUntil] = useState<number>(0);
	const shakeX = useRef(new Animated.Value(0)).current;
	const bounceY = useRef(new Animated.Value(0)).current;
	const [interactionStartTime, setInteractionStartTime] = useState<number>(
		Date.now()
	);
	const retakeLocked = Date.now() < retakeLockedUntil;
	const cameraRef = useRef<CameraView>(null);

	useEffect(() => {
		loadUid();
		// Debug: Show current API configuration
		console.log(" API Config:", getDebugInfo());
	}, []);

	const loadUid = async () => {
		if (Platform.OS === "web") return;

		try {
			const storedUid = await SecureStore.getItemAsync("userUid");
			setUid(storedUid);
		} catch (error) {
			console.error("Failed to load UID:", error);
		}
	};

	const storeUid = async (newUid: string) => {
		if (Platform.OS === "web") {
			setUid(newUid);
			return;
		}

		try {
			await SecureStore.setItemAsync("userUid", newUid);
			setUid(newUid);
		} catch (error) {
			console.error("Failed to store UID:", error);
		}
	};

  const getDeviceInfo = () => {
    return {
      platform: Platform.OS,
      appVersion: "1.0.0",
      timestamp: new Date().toISOString(),
    };
  };

	const analyzeFaceFromImage = (imageUri: string) => {
		console.log("📊 Performing deterministic analysis on:", imageUri);

		// Use consistent hash of image URI for deterministic behavior
		const imageHash = imageUri.length % 100;

		const faceDetected = imageHash > 20; // 80% detection rate
		const estimatedAge = 20 + (imageHash % 40); // Age 20-60
		const gender = imageHash % 2 === 0 ? "male" : "female";

		// Emotion mapping based on image hash
		const emotions = ["happy", "neutral", "sad", "angry"];
		const dominantEmotion = emotions[imageHash % emotions.length];

		console.log("📊 Deterministic analysis result:", {
			faceDetected,
			estimatedAge,
			gender,
			dominantEmotion,
		});
		const retakeLocked = Date.now() < retakeLockedUntil;

		return {
			faceDetected,
			estimatedAge,
			gender,
			dominantEmotion,
		};
	};

	// Deterministic image metrics
	const calculateImageMetrics = (
		imageUri: string,
		interactionDuration: number
	) => {
		console.log("📈 Calculating deterministic metrics for:", imageUri);

		const imageFactor = (imageUri.length % 50) / 50; // 0-1 normalized
		const durationFactor = Math.min(interactionDuration / 10000, 1); // Normalize duration

		const brightness = 0.3 + imageFactor * 0.4 + durationFactor * 0.3; // 0.3-1.0
		const backgroundClutter = 0.1 + (imageUri.length % 80) / 80; // 0.1-1.1

		console.log("📈 Deterministic metrics result:", {
			brightness,
			backgroundClutter,
		});

		return { brightness, backgroundClutter };
	};

	const recordEvent = async (eventType: string, data?: any) => {
		try {
			console.log("📊 Recording event to:", getBaseUrl());

			const response = await fetch(getApiUrl("/api/selfie/event"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					uid,
					type: eventType,
					data: { ...data, timestamp: new Date() },
				}),
			});

			if (!response.ok) {
				console.error("❌ Event recording failed:", response.status);
				return;
			}

			console.log("✅ Event recorded:", eventType);
		} catch (error) {
			console.error("Failed to record event:", error);
		}
	};

	const renderCameraGate = () => {
		if (!permission) {
			return <View style={styles.center} />;
		}

		if (!permission.granted) {
			return (
				<View style={styles.center}>
					<Text style={styles.centerText}>Camera is blocked</Text>
					<Button title="allow camera" onPress={requestPermission} />
				</View>
			);
		}

		return null;
	};

  async function takePhoto() {
    try {
      const camera = cameraRef.current;
      if (!camera) return;

      setInteractionStartTime(Date.now());

			const photoData = await camera.takePictureAsync({
				quality: 1,
				base64: true,
			});

			setPhoto(photoData.uri);
			setAnalysis(null); // Reset previous analysis

			console.log("PHOTO URI:", photoData.uri);
		} catch (err) {
			console.error("Erreur lors de la capture:", err);
		}
	}

	const analyzeSelfie = async () => {
		if (!photo) return;

		setLoading(true);
		try {
			// Perform deterministic face analysis
			const deviceInfo = getDeviceInfo();
			const faceAnalysis = analyzeFaceFromImage(photo);

			// Calculate deterministic image metrics
			const interactionDuration = Date.now() - interactionStartTime;
			const imageMetrics = calculateImageMetrics(photo, interactionDuration);

			// Prepare analysis data
			const analysisData = {
				uid: uid || undefined,
				...faceAnalysis,
				...imageMetrics,
				deviceInfo,
				interactionDuration,
				timestamp: new Date(),
			};

			console.log("📤 Sending analysis data:", analysisData);

      const response = await fetch(getApiUrl('/api/selfie/analyze'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analysisData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

			const result = await response.json();
			setAnalysis(result.analysis);
			const now = Date.now();
			const shouldPunish =
				(result.analysis.backgroundClutter ?? 0) > 0.5 ||
				(result.analysis.brightness ?? 1) < 0.3;
			if (shouldPunish) setRetakeLockedUntil(now + 3000);

			if (result.uid && !uid) {
				await storeUid(result.uid);
			}

      console.log("✅ Analysis saved successfully:", result);
      
      // Record completion event
      recordEvent("selfie_analysis_complete", { 
        analysisId: result.analysis.id,
        faceDetected: faceAnalysis.faceDetected,
        emotion: faceAnalysis.dominantEmotion,
        age: faceAnalysis.estimatedAge
      });
      
    } catch (error) {
      console.error("❌ Analysis error:", error);
      Alert.alert("Error", `Failed to analyze selfie: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

	const getTheme = () => {
		if (!analysis) return styles.defaultTheme;

		let theme = { ...styles.defaultTheme };

		// Age-based theming
		if (analysis.estimatedAge && analysis.estimatedAge < 25) {
			theme = { ...theme, ...styles.playfulTheme };
		} else {
			theme = { ...theme, ...styles.seriousTheme };
		}

		// Emotion-based theming
		if (
			analysis.dominantEmotion === "sad" ||
			analysis.dominantEmotion === "angry"
		) {
			theme = { ...theme, ...styles.darkTheme };
		}

		return theme;
	};
	const getUiProfile = () => {
		if (!analysis) {
			return {
				bg: "#000",
				panelBg: "rgba(0,0,0,0.80)",
				accent: "#ffffff",
				mode: "neutral" as UiMode,
				shake: false,
				bounce: false,
				punish: false,
				taunt: "",
			};
		}

		const age = analysis.estimatedAge ?? 30;
		const emotion = analysis.dominantEmotion ?? "neutral";
		const bright = analysis.brightness;
		const clutter = analysis.backgroundClutter;

		// base
		let profile = {
			bg: "#000",
			panelBg: "rgba(0,0,0,0.80)",
			accent: "#ffffff",
			mode: "neutral" as const,
			shake: false,
			bounce: false,
			punish: false,
			taunt: "",
		};

		// <25 = fun & extreme
		if (age < 25) {
			profile = {
				...profile,
				bg: "#1a0033",
				panelBg: "rgba(255,255,255,0.10)",
				accent: "#ff4dff",
				bounce: true,
				taunt: "✨ Looking young? The system is *watching* you anyway.",
			};
		} else {
			profile = {
				...profile,
				bg: "#001a33",
				panelBg: "rgba(0,0,0,0.85)",
				accent: "#3ea6ff",
				taunt: "🔎 Profile updated. You are now easier to predict.",
			};
		}

		// sad/angry = oppressive
		if (emotion === "sad" || emotion === "angry") {
			profile = {
				...profile,
				bg: "#0d1117",
				panelBg: "rgba(10,10,10,0.92)",
				accent: "#ff3b30",
				shake: true,
				taunt: "⚠️ Emotional instability detected. Monitoring increased.",
			};
		}

		// brightness low = picky UI
		if (bright < 0.3) {
			profile = {
				...profile,
				punish: true,
				taunt:
					"☁️ Low light = low trust. Improve conditions to regain control.",
			};
		}

		// clutter high = punish harder
		if (clutter > 0.5) {
			profile = {
				...profile,
				punish: true,
				taunt: "🧠 High clutter detected. You’re easier to stereotype.",
			};
		}

		return profile;
	};

	const ui = getUiProfile();
	const theme = getTheme();
	useEffect(() => {
		if (!analysis) return;

		// SHAKE animation
		if (ui.shake) {
			Animated.loop(
				Animated.sequence([
					Animated.timing(shakeX, {
						toValue: 6,
						duration: 60,
						useNativeDriver: true,
					}),
					Animated.timing(shakeX, {
						toValue: -6,
						duration: 60,
						useNativeDriver: true,
					}),
					Animated.timing(shakeX, {
						toValue: 4,
						duration: 60,
						useNativeDriver: true,
					}),
					Animated.timing(shakeX, {
						toValue: 0,
						duration: 60,
						useNativeDriver: true,
					}),
				])
			).start();
		} else {
			shakeX.setValue(0);
		}

		// BOUNCE animation
		if (ui.bounce) {
			Animated.loop(
				Animated.sequence([
					Animated.timing(bounceY, {
						toValue: -8,
						duration: 350,
						easing: Easing.out(Easing.quad),
						useNativeDriver: true,
					}),
					Animated.timing(bounceY, {
						toValue: 0,
						duration: 350,
						easing: Easing.in(Easing.quad),
						useNativeDriver: true,
					}),
				])
			).start();
		} else {
			bounceY.setValue(0);
		}
	}, [analysis, ui.shake, ui.bounce]);

	return (
		<View style={[styles.container, { backgroundColor: ui.bg }]}>
			{renderCameraGate()}

			{!photo ? (
				<View style={styles.cameraContainer}>
					<CameraView ref={cameraRef} facing="front" style={styles.camera} />

					<View style={styles.buttonOverlay}>
						<Button title="Take a selfie !" onPress={takePhoto} color="black" />
					</View>
				</View>
			) : (
				<View style={styles.imageContainer}>
					<Image source={{ uri: photo }} style={styles.fullScreenImage} />

					<View style={styles.buttonOverlay}>
						<Button
							title={retakeLocked ? "retake (locked)" : "retake"}
							onPress={() => setPhoto(null)}
							color="black"
							disabled={retakeLocked}
						/>
						<Button
							title="analyze"
							onPress={analyzeSelfie}
							disabled={loading}
							color="black"
						/>
					</View>

					{loading && (
						<View style={styles.loadingOverlay}>
							<ActivityIndicator size="large" color="#fff" />
							<Text style={styles.loadingText}>Analyzing...</Text>
						</View>
					)}

					{analysis && (
						<View style={styles.analysisOverlay}>
							<Animated.View
								style={[
									styles.analysisContainer,
									{
										backgroundColor: ui.panelBg,
										borderColor: ui.accent,
										transform: [
											{ translateX: shakeX },
											{ translateY: bounceY },
										],
									},
									ui.punish ? styles.punishPanel : null,
								]}
							>
								<Text style={styles.analysisTitle}>🧠 Analysis Result</Text>
								{analysis.id && (
									<View style={styles.analysisItem}>
										<Text style={styles.analysisLabel}>Analysis ID</Text>
										<Text style={styles.analysisValue}>{analysis.id}</Text>
									</View>
								)}
								<View style={styles.analysisItem}>
									<Text style={styles.analysisLabel}>Face detected</Text>
									<Text style={styles.analysisValue}>
										{analysis.faceDetected ? "Yes" : "No"}
									</Text>
								</View>
								{analysis.gender && (
									<View style={styles.analysisItem}>
										<Text style={styles.analysisLabel}>Gender</Text>
										<Text style={styles.analysisValue}>{analysis.gender}</Text>
									</View>
								)}
								{analysis.estimatedAge && (
									<View style={styles.analysisItem}>
										<Text style={styles.analysisLabel}>Estimated age</Text>
										<Text style={styles.analysisValue}>
											{analysis.estimatedAge}
										</Text>
									</View>
								)}
								{analysis.dominantEmotion && (
									<View style={styles.analysisItem}>
										<Text style={styles.analysisLabel}>Emotion</Text>
										<Text style={styles.analysisValue}>
											{analysis.dominantEmotion}
										</Text>
									</View>
								)}
								<View style={styles.analysisItem}>
									<Text style={styles.analysisLabel}>Brightness</Text>
									<Text style={styles.analysisValue}>
										{analysis.brightness.toFixed(2)}
									</Text>
								</View>
								<View style={styles.analysisItem}>
									<Text style={styles.analysisLabel}>Background clutter</Text>
									<Text style={styles.analysisValue}>
										{analysis.backgroundClutter.toFixed(2)}
									</Text>
								</View>
								{analysis.deviceInfo?.platform && (
									<View style={styles.analysisItem}>
										<Text style={styles.analysisLabel}>Platform</Text>
										<Text style={styles.analysisValue}>
											{analysis.deviceInfo.platform}
										</Text>
									</View>
								)}
								{analysis.deviceInfo?.timestamp && (
									<View style={styles.analysisItem}>
										<Text style={styles.analysisLabel}>Captured at</Text>
										<Text style={styles.analysisValue}>
											{new Date(analysis.deviceInfo.timestamp).toLocaleString()}
										</Text>
									</View>
								)}
								{ui.taunt !== "" && (
									<Text style={[styles.tauntText, { color: ui.accent }]}>
										{ui.taunt}
									</Text>
								)}{" "}
							</Animated.View>
						</View>
					)}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000",
	},
	centerText: {
		color: "#fff",
		marginBottom: 20,
	},
	cameraContainer: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	imageContainer: {
		flex: 1,
	},
	fullScreenImage: {
		width: width,
		height: height,
		resizeMode: "cover",
	},
	buttonOverlay: {
		position: "absolute",
		bottom: 50,
		left: 20,
		right: 20,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	loadingOverlay: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: [{ translateX: -50 }, { translateY: -50 }],
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.7)",
		padding: 20,
		borderRadius: 10,
	},
	loadingText: {
		color: "#fff",
		marginTop: 10,
		fontSize: 16,
	},
	analysisOverlay: {
		position: "absolute",
		bottom: 120,
		left: 10,
		right: 10,
		maxHeight: "60%",
	},
	analysisContainer: {
		backgroundColor: "rgba(0,0,0,0.8)",
		padding: 20,
		borderRadius: 10,
	},
	analysisTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
		textAlign: "center",
		color: "#fff",
	},
	analysisItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255,255,255,0.2)",
	},
	analysisLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#fff",
		flex: 1,
	},
	analysisValue: {
		fontSize: 16,
		color: "#fff",
		flex: 2,
		textAlign: "right",
	},
	suggestion: {
		marginTop: 15,
		padding: 10,
		backgroundColor: "rgba(255,193,7,0.9)",
		borderRadius: 5,
		fontSize: 14,
		color: "#856404",
	},
	// Theme styles
	defaultTheme: {
		backgroundColor: "#000",
	},
	playfulTheme: {
		backgroundColor: "#1a0033",
	},
	seriousTheme: {
		backgroundColor: "#001a33",
	},
	darkTheme: {
		backgroundColor: "#0d1117",
	},
	punishPanel: {
		borderWidth: 2,
		borderStyle: "dashed",
		shadowOpacity: 0.9,
		shadowRadius: 12,
	},

	tauntText: {
		marginTop: 6,
		marginBottom: 12,
		fontSize: 13,
		textAlign: "center",
		fontWeight: "700",
		letterSpacing: 0.2,
	},
});
