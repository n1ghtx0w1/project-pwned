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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  useEffect(() => {
    if (error) setError("");
  }, [email, password]);
  
  useEffect(() => {
    if (step === "email") {
      setPassword("");
    }
  }, [step]);  

  async function handleLogin() {
    setError("");
  
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    if (!password.trim()) {
      setError("Password cannot be empty.");
      return;
    }
  
    setLoading(true);
  
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
  
    if (signInError || !data.user) {
      setError("Login failed: " + (signInError?.message ?? "Unknown error"));
      setStep("password");
      setLoading(false);
      return;
    }
  
    const { data: profile } = await supabase
      .from("profiles")
      .select("marked_for_deletion_at")
      .eq("id", data.user.id)
      .single();
  
    if (profile?.marked_for_deletion_at) {
      router.replace("/reactivate");
    } else {
      router.replace("/profile");
    }
  
    setLoading(false);
  }  

  return (
    <View style={styles.container}>
      <View style={styles.asciiContainer}>
        <Text style={styles.asciiArt}>{ascii}</Text>
      </View>

      <View style={styles.line}>
        <Text style={styles.prompt}>login@project-pwned:~$ </Text>
        <TextInput
          style={[styles.input, Platform.OS === "web" && { outlineWidth: 0 }]}
          placeholder="email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={() => {
            setStep("password");
            passwordRef.current?.focus();
          }}
          blurOnSubmit={false}
          autoCapitalize="none"
          keyboardType="email-address"
          autoFocus
        />
      </View>

      {step === "password" && (
        <View style={styles.line}>
          <Text style={styles.prompt}>password: </Text>
          <TextInput
            ref={passwordRef}
            style={[styles.input, Platform.OS === "web" && { outlineWidth: 0 }]}
            value={password}
            placeholder="password"
            placeholderTextColor="#555"
            onChangeText={setPassword}
            secureTextEntry
            onSubmitEditing={handleLogin}
            blurOnSubmit={true}
          />
        </View>
      )}

      {error !== "" && <Text style={styles.error}>Error: {error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.signupLink}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/reset-password")}>
      <Text style={{ color: "#00FF00", fontFamily: "Courier", marginTop: 10 }}>
      Forgot password?
      </Text>
      </TouchableOpacity>


    </View>
  );
}

const ascii = `
                        .,,uod8B8bou,,.
              ..,uod8BBBBBBBBBBBBBBBBRPFT?l!i:.
         ,=m8BBBBBBBBBBBBBBBRPFT?!||||||||||||||
         !...:!TVBBBRPFT||||||||||!!^^""'   ||||
         !.......:!?|||||!!^^""'            ||||
         !.........||||                     ||||
         !.........||||  ##                 ||||
         !.........||||                     ||||
         !.........||||                     ||||
         !.........||||                     ||||
         !.........||||                     ||||
         \`.........||||                    ,||||
          .;.......||||               _.-!!|||||
   .,uodWBBBBb.....||||       _.-!!|||||||||!:'
!YBBBBBBBBBBBBBBb..!|||:..-!!|||||||!iof68BBBBBb....
!..YBBBBBBBBBBBBBBb!!||||||||!iof68BBBBBBRPFT?!::   \`.
!....YBBBBBBBBBBBBBBbaaitf68BBBBBBRPFT?!:::::::::     \`.
!......YBBBBBBBBBBBBBBBBBBBRPFT?!::::::;:!^\`";:::       \`.
!........YBBBBBBBBBBRPFT?!::::::::::^''...::::::;         iBBbo.
\`..........YBRPFT?!::::::::::::::::::::::::;iof68bo.      WBBBBbo.
  \`..........:::::::::::::::::::::::;iof688888888888b.     \`YBBBP^'
    \`........::::::::::::::::;iof688888888888888888888b.     
      \`......:::::::::;iof688888888888888888888888888888b.
        \`....:::;iof688888888888888888888888888888888899fT!
          \`..::!8888888888888888888888888888888899fT|!^"'
            \`' !!988888888888888888888888899fT|!^"'
                \`!!8888888888888888899fT|!^"'
                  \`!988888888899fT|!^"'
                    \`!9899fT|!^"'
                      \`!^"'
`;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  asciiContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  asciiArt: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 7.5,
    lineHeight: 9,
    textAlign: "left",
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    flexWrap: "nowrap",
  },
  prompt: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 16,
  },
  input: {
    width: 250,
    height: 24,
    color: "#FFFFFF",
    fontFamily: "Courier",
    fontSize: 16,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    textAlign: "left",
  },
  button: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#00FF00",
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 16,
  },
  signupLink: {
    color: "#00FF00",
    marginTop: 12,
    fontFamily: "Courier",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginTop: 12,
    fontFamily: "Courier",
  },
});
