import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import bannedWords from "../lib/bannedWords";
import { useSession } from "../lib/sessionContext";
import { supabase } from "../lib/supabase";

export default function CreateProfile() {
  const { session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false); // ✅ Mount check

  useEffect(() => {
    setMounted(true); // ✅ Avoid routing before layout is ready
  }, []);

  useEffect(() => {
    if (!mounted || session === undefined) return;

    async function checkAccess() {
      if (!session?.user?.id) {
        router.replace("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (data) {
        router.replace("/profile");
      }
    }

    checkAccess();
  }, [mounted, session]);

  if (!mounted || session === undefined) return null;

  async function handleCreate() {
    setError("");
    setSubmitting(true);

    const trimmed = username.trim();

    if (trimmed.length < 3) {
      setError("Alias must be at least 3 characters.");
      setSubmitting(false);
      return;
    }

    if (bannedWords.some((word) => trimmed.toLowerCase().includes(word))) {
      setError("Alias contains inappropriate language.");
      setSubmitting(false);
      return;
    }

    const { data: taken } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", trimmed);

    if (taken?.length) {
      setError("Alias is already taken.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("profiles").upsert({
      id: session?.user.id,
      username: trimmed,
      rank: "Script Kiddie",
    });

    if (insertError) {
      console.error(insertError);
      setError(insertError.message || "Failed to create profile.");
      setSubmitting(false);
      return;
    }

    router.replace("/profile");
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../assets/avatars/default.png")}
          style={styles.avatar}
        />
        <Text style={styles.title}>Create Hacker Profile</Text>

        <TextInput
          style={[styles.input, Platform.OS === "web" && { outlineWidth: 0 }]}
          placeholder="Enter your alias"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
        />

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreate}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Creating..." : "Create Profile"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderColor: "#00FF00",
    borderWidth: 2,
    marginBottom: 16,
  },
  title: {
    fontFamily: "Courier",
    fontSize: 20,
    color: "#00FF00",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#00FF00",
    color: "#FFF",
    fontFamily: "Courier",
    fontSize: 16,
    marginBottom: 16,
    paddingVertical: 4,
    width: "100%",
    textAlign: "left",
    backgroundColor: "transparent",
  },
  error: {
    color: "red",
    fontFamily: "Courier",
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    borderColor: "#00FF00",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 16,
  },
});
