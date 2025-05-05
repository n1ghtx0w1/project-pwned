import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function ResetPasswordConfirmScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure the session is valid and user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        setError("Invalid or expired session. Please request a new password reset.");
      }
    });
  }, []);

  async function handleUpdatePassword() {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Failed to update password: " + error.message);
    } else {
      setSuccess("Password updated! You can now log in.");
      setTimeout(() => router.replace("/login"), 2000);
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.ascii}>
{`
RRRR   EEEEE  SSSS  EEEEE  TTTTT     PPPP   AAAAA  SSSS  SSSS  W   W  OOO  RRRR   DDDD
R   R  E     S      E        T       P   P  A   A  S     S     W   W O   O R   R  D   D
RRRR   EEEE   SSS   EEEE     T       PPPP   AAAAA   SSS   SSS  W W W O   O RRRR   D   D
R  R   E         S  E        T       P      A   A      S     S W W W O   O R  R   D   D
R   R  EEEEE SSSS   EEEEE    T       P      A   A  SSSS  SSSS   W W   OOO  R   R  DDDD
`}
</Text>
      <TextInput
        style={[styles.input, Platform.OS === "web" && { outlineWidth: 0 }]}
        placeholder="New Password"
        placeholderTextColor="#555"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={[styles.input, Platform.OS === "web" && { outlineWidth: 0 }]}
        placeholder="Confirm New Password"
        placeholderTextColor="#555"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleUpdatePassword} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Updating..." : "Update Password"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    color: "#00FF00",
    fontSize: 20,
    marginBottom: 20,
    fontFamily: "Courier",
  },
  input: {
    width: "100%",
    maxWidth: 300,
    height: 40,
    color: "#FFFFFF",
    fontFamily: "Courier",
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#00FF00",
    backgroundColor: "transparent",
  },
  button: {
    borderWidth: 1,
    borderColor: "#00FF00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontFamily: "Courier",
  },
  success: {
    color: "#00FF00",
    marginBottom: 10,
    fontFamily: "Courier",
  },
  ascii: {
    fontFamily: "Courier",
    color: "#00FF00",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },  
});
