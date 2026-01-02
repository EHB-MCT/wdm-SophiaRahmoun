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
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { getApiUrl, getBaseUrl } from "../config/network";

interface AnalysisResult {
	faceDetected: boolean;
	estimatedAge?: number;
	gender?: string;
	dominantEmotion?: string;
	brightness: number;
	backgroundClutter: number;
}

export default function SelfieScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const [photo, setPhoto] = useState<string | null>(null);
	const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [uid, setUid] = useState<string | null>(null);
	const [interactionStartTime, setInteractionStartTime] = useState<number>(
		Date.now()
	);
	const cameraRef = useRef<CameraView>(null);

	useEffect(() => {
		loadUid();
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
		try {
			if (Platform.OS !== "web") {
				await SecureStore.setItemAsync("userUid", newUid);
			}
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

	const analyzeFaceFromImage = async (imageUri: string) => {
		// Mock face analysis for React Native
		console.log("📊 Performing mock face analysis on:", imageUri);

		const mockFaceData = {
			faceDetected: Math.random() > 0.3, // 70% chance of face detection
			estimatedAge: Math.round(18 + Math.random() * 50), // 18-68 range
			gender: Math.random() > 0.5 ? "male" : "female",
			dominantEmotion: ["happy", "sad", "angry", "neutral"][
				Math.floor(Math.random() * 4)
			],
		};

		console.log("📊 Mock analysis result:", mockFaceData);
		return mockFaceData;
	};

	const calculateImageMetrics = async (imageUri: string) => {
		// Mock image metrics calculation
		console.log("Calculating mock image metrics for:", imageUri);

		const brightness = 0.5 + Math.random() * 0.5; // 0.5-1.0 range
		const backgroundClutter = Math.random(); // 0-1 range

		console.log("Mock metrics result:", { brightness, backgroundClutter });
		return { brightness, backgroundClutter };
	};

	const recordEvent = async (eventType: string, data?: any) => {
		try {
			console.log("Recording event to:", getBaseUrl());

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
				console.error("Event recording failed:", response.status);
				return;
			}
			if (!uid) {
				console.warn("Skipping event: no UID yet");
				return;
			}

			console.log("✅ Event recorded:", eventType);
		} catch (error) {
			console.error("Failed to record event:", error);
		}
	};

	// Record page view event
	useEffect(() => {
		recordEvent("navigation", { page: "selfie_capture", action: "page_view" });
	}, []);

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.center}>
				<Text style={{ marginBottom: 10 }}>La caméra est bloquée</Text>
				<Button title="Autoriser l'accès" onPress={requestPermission} />
			</View>
		);
	}

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
			console.log("PHOTO BASE64 length:", photoData.base64?.length);
		} catch (err) {
			console.error("Erreur lors de la capture:", err);
		}
	}

	const analyzeSelfie = async () => {
		if (!photo) return;

		setLoading(true);
		try {
			// Perform face analysis
			const faceAnalysis = await analyzeFaceFromImage(photo);

			// Calculate image metrics
			const imageMetrics = await calculateImageMetrics(photo);

			// Prepare behavioral data
			const interactionDuration = Date.now() - interactionStartTime;
			const deviceInfo = getDeviceInfo();

			const analysisData = {
				uid: uid || undefined,
				...faceAnalysis,
				...imageMetrics,
				deviceInfo,
				interactionDuration,
				timestamp: new Date(),
			};

			console.log("📤 Sending analysis data to:", getBaseUrl());
			console.log("📤 Analysis data:", analysisData);

			const response = await fetch(getApiUrl("/api/selfie/analyze"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(analysisData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `HTTP error! status: ${response.status}`
				);
			}

			const result = await response.json();
			setAnalysis(result.analysis);

			if (result.uid && !uid) {
				await storeUid(result.uid);
			}

			console.log("✅ Analysis saved successfully:", result);

			// Record completion event
			recordEvent("selfie_analysis_complete", {
				analysisId: result.analysis.id,
				faceDetected: faceAnalysis.faceDetected,
				emotion: faceAnalysis.dominantEmotion,
				age: faceAnalysis.estimatedAge,
			});
		} catch (error) {
			console.error("❌ Analysis error:", error);
			Alert.alert(
				"Error",
				`Failed to analyze selfie: ${(error as Error).message}`
			);
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

	const theme = getTheme();

	return (
		<View style={[styles.container, theme]}>
			{!photo ? (
				<>
					<CameraView ref={cameraRef} facing="front" style={styles.camera} />

					<View style={styles.buttonContainer}>
						<Button title="Take Picture" onPress={takePhoto} />
					</View>
				</>
			) : (
				<>
					<Image source={{ uri: photo }} style={styles.img} />

					<View style={styles.buttonContainer}>
						<Button title="↩️Retake" onPress={() => setPhoto(null)} />
						<Button
							title="Analyse"
							onPress={analyzeSelfie}
							disabled={loading}
						/>
					</View>

					{loading && (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="large" color="#0000ff" />
							<Text style={styles.loadingText}>Analyse en cours...</Text>
						</View>
					)}

					{analysis && (
						<View style={styles.analysisContainer}>
							<Text style={styles.analysisTitle}>Résultats de l'analyse</Text>

							<View style={styles.analysisItem}>
								<Text style={styles.analysisLabel}>Visage détecté:</Text>
								<Text style={styles.analysisValue}>
									{analysis.faceDetected ? "Oui" : "Non"}
								</Text>
							</View>

							{analysis.faceDetected && (
								<>
									{analysis.estimatedAge && (
										<View style={styles.analysisItem}>
											<Text style={styles.analysisLabel}>Âge estimé:</Text>
											<Text style={styles.analysisValue}>
												{analysis.estimatedAge} ans
											</Text>
										</View>
									)}

									{analysis.gender && (
										<View style={styles.analysisItem}>
											<Text style={styles.analysisLabel}>Genre:</Text>
											<Text style={styles.analysisValue}>
												{analysis.gender === "male"
													? "Homme"
													: analysis.gender === "female"
														? "Femme"
														: "Inconnu"}
											</Text>
										</View>
									)}

									{analysis.dominantEmotion && (
										<View style={styles.analysisItem}>
											<Text style={styles.analysisLabel}>
												Émotion dominante:
											</Text>
											<Text style={styles.analysisValue}>
												{analysis.dominantEmotion}
											</Text>
										</View>
									)}
								</>
							)}

							<View style={styles.analysisItem}>
								<Text style={styles.analysisLabel}>Luminosité:</Text>
								<Text style={styles.analysisValue}>
									{Math.round(analysis.brightness * 100)}%
									{analysis.brightness < 0.3 && " (Faible)"}
									{analysis.brightness > 0.7 && " (Élevée)"}
								</Text>
							</View>

							<View style={styles.analysisItem}>
								<Text style={styles.analysisLabel}>Encombrement du fond:</Text>
								<Text style={styles.analysisValue}>
									{Math.round(analysis.backgroundClutter * 100)}%
									{analysis.backgroundClutter > 0.5 && " (Élevé)"}
								</Text>
							</View>

							{uid && (
								<View style={styles.analysisItem}>
									<Text style={styles.analysisLabel}>ID Utilisateur:</Text>
									<Text style={styles.analysisValue}>{uid}</Text>
								</View>
							)}

							{analysis.brightness < 0.3 && (
								<Text style={styles.suggestion}>
									💡 Suggestion: La luminosité est faible. Essayez de vous
									placer dans un endroit mieux éclairé.
								</Text>
							)}
						</View>
					)}
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	camera: {
		flex: 1,
	},
	img: {
		flex: 1,
		width: "100%",
		resizeMode: "contain",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 20,
		backgroundColor: "#fff",
	},
	loadingContainer: {
		alignItems: "center",
		padding: 20,
		backgroundColor: "#fff",
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
	},
	analysisContainer: {
		backgroundColor: "#fff",
		margin: 10,
		padding: 20,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	analysisTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
		textAlign: "center",
	},
	analysisItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	analysisLabel: {
		fontSize: 16,
		fontWeight: "600",
	},
	analysisValue: {
		fontSize: 16,
	},
	suggestion: {
		marginTop: 15,
		padding: 10,
		backgroundColor: "#fff3cd",
		borderRadius: 5,
		fontSize: 14,
		color: "#856404",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	// Theme styles
	defaultTheme: {
		backgroundColor: "#f5f5f5",
	},
	playfulTheme: {
		backgroundColor: "#ffe6f0",
	},
	seriousTheme: {
		backgroundColor: "#f0f0f0",
	},
	darkTheme: {
		backgroundColor: "#e6e6e6",
	},
});
