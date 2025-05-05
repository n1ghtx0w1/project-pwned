import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProtectedRoute from "../components/ProtectedRoute";
import { useSession } from "../lib/sessionContext";
import { supabase } from "../lib/supabase";

export default function ViewProfileScreen() {
  const { session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [rank, setRank] = useState("Script Kiddie");

  useEffect(() => {
    if (!session?.user?.id) return;

    async function loadProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("username, rank")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setUsername(data.username || "");
        setRank(data.rank || "Script Kiddie");
      }
    }

    loadProfile();
  }, [session]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Image
          source={require("../assets/avatars/default.png")}
          style={styles.avatar}
        />

        <View style={styles.content}>
          <Text style={styles.label}>Hacker Alias</Text>
          <Text style={styles.value}>{username}</Text>

          <Text style={styles.label}>Rank</Text>
          <Text style={styles.value}>{rank}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/settings/profile")}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
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
    justifyContent: "center",
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#00FF00",
    marginBottom: 20,
  },
  content: {
    alignSelf: "center",
    maxWidth: 360,
    width: "100%",
  },
  label: {
    color: "#00FF00",
    fontFamily: "Courier",
    marginTop: 12,
  },
  value: {
    color: "#FFF",
    fontFamily: "Courier",
    marginBottom: 8,
  },
  button: {
    borderColor: "#00FF00",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Courier",
    fontSize: 16,
    color: "#00FF00",
  },
});
