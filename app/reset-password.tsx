import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";


export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState<number>(0);
  const handleReset = async () => {
    setMessage("");
    setError("");
    if (cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before trying again.`);
      return;
    }    
    const cooldownKey = `pw_reset_${email.trim().toLowerCase()}`;
    const lastReset = localStorage.getItem(cooldownKey);
    const now = Date.now();
  
    if (lastReset && now - parseInt(lastReset) < 10 * 60 * 1000) {
      const minutesLeft = Math.ceil((10 * 60 * 1000 - (now - parseInt(lastReset))) / 60000);
      setError(`You must wait ${minutesLeft} more minute(s) before requesting another reset.`);
      return;
    }
  
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: "http://localhost:8081/reset-password-confirm",
      }
    );
  
    if (error) {
      setError("Error: " + error.message);
    } else {
      localStorage.setItem(cooldownKey, now.toString());
      setMessage("If the email entered is associated with an account, then a reset email has been sent. Check your inbox.");
      setCooldown(600); // 10 minutes = 600 seconds
    }
  };
  useEffect(() => {
    if (cooldown <= 0) return;
  
    const interval = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [cooldown]);
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
        placeholder="Enter your email"
        placeholderTextColor="#555"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {message && <Text style={styles.message}>{message}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
      style={[styles.button, cooldown > 0 && { opacity: 0.5 }]}
      onPress={handleReset}
      disabled={cooldown > 0}
      >
  <Text style={styles.buttonText}>Send Reset Link</Text>
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
  prompt: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    maxWidth: 300,
    height: 30,
    color: "#fff",
    fontFamily: "Courier",
    fontSize: 16,
    borderWidth: 0,
    backgroundColor: "transparent",
    marginBottom: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: "#00FF00",
    paddingVertical: 8,
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
    fontFamily: "Courier",
    marginTop: 10,
  },
  message: {
    color: "#00FF00",
    fontFamily: "Courier",
    marginTop: 10,
  },
  ascii: {
    fontFamily: "Courier",
    color: "#00FF00",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },  
});
