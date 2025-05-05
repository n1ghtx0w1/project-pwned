import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSession } from "../../lib/sessionContext";
import { supabase } from "../../lib/supabase";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!session?.user) {
        router.replace("/login");
      }
    }, 50); // Delay ensures router is mounted
  
    return () => clearTimeout(timer);
  }, [session]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function handleChange() {
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      Alert.alert("Success", "Password updated.");
      router.replace("/settings/profile");
    }
  }

  if (!session?.user) return null;
  return (
    <View style={styles.container}>
        <Text style={styles.ascii}>
{`
  CCCC  H   H  AAAAA  N   N  GGGG  EEEEE       PPPPP   AAAAA  SSSS  SSSS  W   W   OOO  RRRR   DDDD
 C      H   H  A   A  NN  N G      E           P   P   A   A S     S     W   W  O   O R   R  D   D
 C      HHHHH  AAAAA  N N N G GGG  EEEE        PPPPP   AAAAA  SSS   SSS  W W W  O   O RRRR   D   D
 C      H   H  A   A  N  NN G   G  E           P       A   A     S     S W W W  O   O R  R   D   D
  CCCC  H   H  A   A  N   N  GGGG  EEEEE       P       A   A SSSS  SSSS   W W    OOO  R   R  DDDD
`}
</Text>  
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#555"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#555"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
  
      {error !== "" && <Text style={styles.error}>{error}</Text>}
  
      <TouchableOpacity style={styles.button} onPress={handleChange}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
  
      <TouchableOpacity
        style={styles.secondary}
        onPress={() => router.replace("/settings/profile")}
      >
        <Text style={styles.buttonText}>Back</Text>
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
    title: {
      fontFamily: "Courier",
      fontSize: 20,
      color: "#00FF00",
      marginBottom: 20,
      textAlign: "center",
    },
    input: {
      width: "100%",
      maxWidth: 300,
      height: 30,
      color: "#FFF",
      fontFamily: "Courier",
      fontSize: 16,
      padding: 4,
      borderWidth: 0,
      backgroundColor: "transparent",
      marginBottom: 10,
    },
    error: {
      fontFamily: "Courier",
      color: "red",
      marginTop: 10,
    },
    button: {
      width: "100%",
      maxWidth: 300,
      borderColor: "#00FF00",
      borderWidth: 1,
      paddingVertical: 8,
      alignItems: "center",
      marginTop: 10,
    },
    secondary: {
      width: "100%",
      maxWidth: 300,
      marginTop: 12,
      borderColor: "#00FF00",
      borderWidth: 1,
      paddingVertical: 8,
      alignItems: "center",
    },
    buttonText: {
      fontFamily: "Courier",
      color: "#00FF00",
      fontSize: 16,
    },
    ascii: {
        fontFamily: "Courier",
        color: "#00FF00",
        fontSize: 10,
        textAlign: "center",
        marginBottom: 16,
      },      
  });
  