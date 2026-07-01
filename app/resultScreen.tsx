import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { analyzeImage, PROMPTS } from "../lib/gemini";

export default function ResultScreen() {
  const params = useLocalSearchParams();

  const base64Image =
    typeof params.base64Image === "string"
      ? params.base64Image
      : Array.isArray(params.base64Image)
        ? params.base64Image[0]
        : null;

  const promptKey =
    typeof params.promptKey === "string"
      ? params.promptKey
      : Array.isArray(params.promptKey)
        ? params.promptKey[0]
        : "academic";

  const promptText =
    PROMPTS[promptKey as keyof typeof PROMPTS] ?? PROMPTS.academic;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  function getGeminiText(response: any) {
    const content = response?.candidates?.[0]?.content;
    if (!content) return null;

    if (Array.isArray(content.parts)) {
      return content.parts.map((part: any) => part?.text || "").join("");
    }

    if (Array.isArray(content)) {
      return content
        .map((item: any) =>
          item?.text
            ? item.text
            : Array.isArray(item?.parts)
              ? item.parts.map((part: any) => part?.text || "").join("")
              : "",
        )
        .join("");
    }

    return null;
  }

  function extractJsonString(text: string) {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? match[0] : text;
  }

  useEffect(() => {
    async function runAnalysis() {
      if (!base64Image) {
        setError("No image data was provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await analyzeImage(base64Image, promptText);
        setRawResponse(JSON.stringify(response, null, 2));

        const text = getGeminiText(response);
        setRawText(text ?? null);

        if (!text) {
          setError("Gemini returned no text output.");
          return;
        }

        try {
          setResult(JSON.parse(text));
        } catch (_parseError) {
          const jsonText = extractJsonString(text);

          if (jsonText !== text) {
            try {
              setResult(JSON.parse(jsonText));
              return;
            } catch (secondParseError) {
              console.log(
                "Result parse error after extraction:",
                secondParseError,
              );
            }
          }

          console.log("Result parse error:", _parseError);
          setError("Gemini returned invalid JSON. See raw output below.");
          return;
        }
      } catch (apiError) {
        console.log("Analysis error:", apiError);
        setError("Unable to analyze image. Check the console for details.");
      } finally {
        setLoading(false);
      }
    }

    runAnalysis();
  }, [base64Image, promptText]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        {rawText ? (
          <View style={styles.debugSection}>
            <Text style={styles.debugLabel}>Raw Gemini text:</Text>
            <Text style={styles.debugText}>{rawText}</Text>
          </View>
        ) : null}
        {rawResponse ? (
          <View style={styles.debugSection}>
            <Text style={styles.debugLabel}>Full Gemini response:</Text>
            <Text style={styles.debugText}>{rawResponse}</Text>
          </View>
        ) : null}
      </ScrollView>
    );
  }

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No result found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>AI Analysis</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What I saw</Text>
        {result.objects?.map((item: string, index: number) => (
          <Text key={index} style={styles.cardItem}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Scene</Text>
        <Text style={styles.cardText}>{result.context}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activity</Text>
        <Text style={styles.cardText}>{result.activities}</Text>
      </View>

      <View style={[styles.card, styles.recommendationCard]}>
        <Text style={styles.cardTitle}>Recommendation</Text>
        <Text style={styles.cardText}>{result.recommendations}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  loading: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "#fff",
  },

  error: {
    textAlign: "center",
    marginTop: 50,
    color: "#FF6B6B",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 16,
    color: "#fff",
  },

  card: {
    marginBottom: 16,
    padding: 18,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#A0C8FF",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  cardItem: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 16,
    color: "#E8F0FF",
    lineHeight: 24,
  },

  recommendationCard: {
    backgroundColor: "#283C8E",
  },

  debugSection: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  debugLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A0C8FF",
    marginBottom: 8,
  },

  debugText: {
    fontSize: 12,
    color: "#E8F0FF",
    lineHeight: 18,
  },
});
