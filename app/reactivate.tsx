import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function ReactivateScreen() {
  const [date, setDate] = useState("");

  useEffect(() => {
    async function fetchDeletionDate() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("marked_for_deletion_at")
        .eq("id", user.id)
        .single();

      if (profile?.marked_for_deletion_at) {
        const date = new Date(profile.marked_for_deletion_at);
        setDate(date.toLocaleDateString());
      } else {
        router.replace("/profile");
      }
    }

    fetchDeletionDate();
  }, []);

  async function cancelDeletion() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ marked_for_deletion_at: null })
        .eq("id", user.id);

      router.replace("/profile");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>⚠️ Account Scheduled for Deletion</Text>
      <Text style={styles.text}>
        Your account is set to be deleted on: {date}
      </Text>
      <Text style={styles.text}>
        Logging in will cancel this and reactivate your account.
      </Text>
      <TouchableOpacity style={styles.button} onPress={cancelDeletion}>
        <Text style={styles.buttonText}>Reactivate Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#000", flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  heading: { color: "#ff4444", fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  text: { color: "#fff", fontSize: 16, textAlign: "center", marginBottom: 8 },
  button: { marginTop: 20, padding: 10, borderColor: "#00FF00", borderWidth: 1 },
  buttonText: { color: "#00FF00", fontFamily: "Courier" },
});
