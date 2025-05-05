import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProtectedRoute from "../../components/ProtectedRoute";
import bannedWords from "../../lib/bannedWords";
import { useSession } from "../../lib/sessionContext";
import { supabase } from "../../lib/supabase";

export default function EditProfileScreen() {
  const { session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    async function loadProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setUsername(data.username || "");
      }
    }

    loadProfile();
  }, [session]);

  function containsBannedWords(text: string) {
    const lower = text.toLowerCase();
    return bannedWords.some((word) => lower.includes(word));
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    if (!username || username.trim().length < 3) {
      setError("Hacker alias must be at least 3 characters.");
      setSaving(false);
      return;
    }

    if (containsBannedWords(username)) {
      setError("That alias contains inappropriate language.");
      setSaving(false);
      return;
    }

    const { data: taken } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username.trim())
      .neq("id", session?.user.id);

    if (taken?.length) {
      setError("Alias is already taken.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ username: username.trim() })
      .eq("id", session?.user.id);

    if (updateError) {
      setError("Failed to update profile.");
    } else {
      Alert.alert("Success", "Profile updated.");
      router.replace("/profile");
    }

    setSaving(false);
  }

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Image
          source={require("../../assets/avatars/default.png")}
          style={styles.avatar}
        />

        <View style={styles.form}>
          <Text style={styles.label}>Hacker Alias</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter alias"
            placeholderTextColor="#555"
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondary}
            onPress={() => router.replace("/profile")}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondary}
            onPress={() => router.push("/settings/change-password")}
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondary}
            onPress={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
            }}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.delete}
            onPress={() => router.push("/settings/account")}
          >
            <Text style={[styles.buttonText, { color: "red" }]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontFamily: "Courier",
    color: "#00FF00",
    marginTop: 12,
  },
  input: {
    color: "#FFF",
    fontFamily: "Courier",
    borderBottomColor: "#00FF00",
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 4,
    backgroundColor: "transparent",
    outlineStyle: "none",
    width: "100%",
  },
  error: {
    fontFamily: "Courier",
    color: "red",
    marginTop: 10,
  },
  button: {
    borderColor: "#00FF00",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 20,
    alignItems: "center",
  },
  secondary: {
    borderColor: "#00FF00",
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 16,
    alignItems: "center",
  },
  delete: {
    borderColor: "red",
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Courier",
    color: "#00FF00",
    fontSize: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#00FF00",
  },
  form: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 360,
  },
});
