import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { supabase } from "../lib/supabase";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (error) setError("");
  }, [email, password, confirmPassword]);

  async function handleSignup() {
    setError("");
    setLoading(true);
  
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();
  
    if (!trimmedEmail || !trimmedPassword || !trimmedConfirm) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
  
    if (!isValidEmail(trimmedEmail)) {
      setError("Enter a valid email address.");
      setLoading(false);
      return;
    }
  
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
  
    if (trimmedPassword !== trimmedConfirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
  
    const { data, error: signupError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: trimmedPassword,
    });
  
    if (signupError) {
      setError("Signup failed: " + signupError.message);
      setLoading(false);
      return;
    }
  
    const user = data.user;
    if (user?.id) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username: "",
          avatar: null,
          rank: "Script Kiddie",
        })
        .select()
        .single();
    
      if (insertError) {
        if (insertError.code === "23505") {
          setError("An account already exists for this email. Try logging in or resetting your password.");
        } else if (insertError.message.includes("row-level security")) {
          setError("Access denied when creating your profile. Please contact support or try resetting your password.");
        } else {
          setError("Signup error: " + insertError.message);
        }
        setLoading(false);
        return;
      }
    }    
      
    setLoading(false);
    router.push("/create-profile");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.ascii}>{asciiBanner}</Text>
      <View style={styles.form}>
        <Text style={styles.prompt}>signup@project-pwned:~$</Text>
        <TextInput
          style={[styles.input, Platform.OS === "web" && { outlineWidth: 0 }]}
          placeholder="email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoFocus
        />

        <Text style={styles.prompt}>signup@project-pwned:~$</Text>
        <TextInput
          ref={passwordRef}
          style={[styles.input, Platform.OS === "web" && { outlineWidth: 0 }]}
          placeholder="password"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={() => confirmRef.current?.focus()}
          blurOnSubmit={false}
        />

        <Text style={styles.prompt}>signup@project-pwned:~$</Text>
        <TextInput
          ref={confirmRef}
          style={[styles.input, Platform.OS === "web" && { outlineWidth: 0 }]}
          placeholder="confirm password"
          placeholderTextColor="#555"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          onSubmitEditing={handleSignup}
        />

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Signing up..." : "Sign Up"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const asciiBanner = `
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⡀⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠄⠄⠄⠁⠄⠁⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⣀⣀⣤⣤⣴⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣦⣤⣤⣄⣀⡀⠄⠄⠄⠄⠄
⠄⠄⠄⠄⣴⣿⣿⡿⣿⢿⣟⣿⣻⣟⡿⣟⣿⣟⡿⣟⣿⣻⣟⣿⣻⢿⣻⡿⣿⢿⣷⣆⠄⠄⠄
⠄⠄⠄⢘⣿⢯⣷⡿⡿⡿⢿⢿⣷⣯⡿⣽⣞⣷⣻⢯⣷⣻⣾⡿⡿⢿⢿⢿⢯⣟⣞⡮⡀⠄⠄
⠄⠄⠄⢸⢞⠟⠃⣉⢉⠉⠉⠓⠫⢿⣿⣷⢷⣻⣞⣿⣾⡟⠽⠚⠊⠉⠉⠉⠙⠻⣞⢵⠂⠄⠄
⠄⠄⠄⢜⢯⣺⢿⣻⣿⣿⣷⣔⡄⠄⠈⠛⣿⣿⡾⠋⠁⠄⠄⣄⣶⣾⣿⡿⣿⡳⡌⡗⡅⠄⠄
⠄⠄⠄⢽⢱⢳⢹⡪⡞⠮⠯⢯⡻⡬⡐⢨⢿⣿⣿⢀⠐⡥⣻⡻⠯⡳⢳⢹⢜⢜⢜⢎⠆⠄⠄
⠄⠄⠠⣻⢌⠘⠌⡂⠈⠁⠉⠁⠘⠑⢧⣕⣿⣿⣿⢤⡪⠚⠂⠈⠁⠁⠁⠂⡑⠡⡈⢮⠅⠄⠄
⠄⠄⠠⣳⣿⣿⣽⣭⣶⣶⣶⣶⣶⣺⣟⣾⣻⣿⣯⢯⢿⣳⣶⣶⣶⣖⣶⣮⣭⣷⣽⣗⠍⠄⠄
⠄⠄⢀⢻⡿⡿⣟⣿⣻⣽⣟⣿⢯⣟⣞⡷⣿⣿⣯⢿⢽⢯⣿⣻⣟⣿⣻⣟⣿⣻⢿⣿⢀⠄⠄
⠄⠄⠄⡑⡏⠯⡯⡳⡯⣗⢯⢟⡽⣗⣯⣟⣿⣿⣾⣫⢿⣽⠾⡽⣺⢳⡫⡞⡗⡝⢕⠕⠄⠄⠄
⠄⠄⠄⢂⡎⠅⡃⢇⠇⠇⣃⣧⡺⡻⡳⡫⣿⡿⣟⠞⠽⠯⢧⣅⣃⠣⠱⡑⡑⠨⢐⢌⠂⠄⠄
⠄⠄⠄⠐⠼⣦⢀⠄⣶⣿⢿⣿⣧⣄⡌⠂⠢⠩⠂⠑⣁⣅⣾⢿⣟⣷⠦⠄⠄⡤⡇⡪⠄⠄⠄
⠄⠄⠄⠄⠨⢻⣧⡅⡈⠛⠿⠿⠿⠛⠁⠄⢀⡀⠄⠄⠘⠻⠿⠿⠯⠓⠁⢠⣱⡿⢑⠄⠄⠄⠄
⠄⠄⠄⠄⠈⢌⢿⣷⡐⠤⣀⣀⣂⣀⢀⢀⡓⠝⡂⡀⢀⢀⢀⣀⣀⠤⢊⣼⡟⡡⡁⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠈⢢⠚⣿⣄⠈⠉⠛⠛⠟⠿⠿⠟⠿⠻⠻⠛⠛⠉⠄⣠⠾⢑⠰⠈⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠑⢌⠿⣦⡡⣱⣸⣸⣆⠄⠄⠄⣰⣕⢔⢔⠡⣼⠞⡡⠁⠁⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠑⢝⢷⣕⡷⣿⡿⠄⠄⠠⣿⣯⣯⡳⡽⡋⠌⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠙⢮⣿⣽⣯⠄⠄⢨⣿⣿⡷⡫⠃⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠘⠙⠝⠂⠄⢘⠋⠃⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
`;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  ascii: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 10, // Increase from 6 to 10 or higher
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 14, // Optional: Adjust line spacing for better readability
  },  
  form: {
    width: "100%",
    maxWidth: 300,
  },
  prompt: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 16,
    marginTop: 12,
  },
  input: {
    width: "100%",
    height: 24,
    color: "#FFFFFF",
    fontFamily: "Courier",
    fontSize: 16,
    padding: 0,
    marginBottom: 10,
    borderWidth: 0,
    backgroundColor: "transparent",
    textAlign: "left",
  },
  error: {
    color: "red",
    fontFamily: "Courier",
    fontSize: 14,
    marginVertical: 10,
  },
  button: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#00FF00",
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
