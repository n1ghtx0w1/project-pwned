import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSession } from "../../lib/sessionContext";
import { supabase } from "../../lib/supabase";


export default function AccountSettingsScreen() {
  const { session } = useSession();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [deletionDate, setDeletionDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || session === undefined) return;

    if (!session?.user?.id) {
      router.replace("/login");
    }
  }, [mounted, session]);

  useEffect(() => {
    async function fetchDeletionStatus() {
      if (!session?.user?.id) return;
      const { data } = await supabase
        .from("profiles")
        .select("marked_for_deletion_at")
        .eq("id", session.user.id)
        .single();

      if (data?.marked_for_deletion_at) {
        setDeletionDate(
          new Date(data.marked_for_deletion_at).toLocaleDateString()
        );
      }
    }

    fetchDeletionStatus();
  }, [session]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function handleDeleteAccount() {
    if (loading) return;
  
    console.log("Delete button clicked");
  
    const confirmAndDelete = async () => {
      console.log("User confirmed deletion");
  
      if (!session?.user?.id) {
        Alert.alert("Error", "No active session found.");
        return;
      }
  
      setLoading(true);
  
      const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      console.log("Scheduling deletion for:", twoWeeksFromNow.toISOString());
  
      const { error } = await supabase
        .from("profiles")
        .update({ marked_for_deletion_at: twoWeeksFromNow.toISOString() })
        .eq("id", session.user.id);
  
      if (error) {
        console.error("Supabase update error:", error);
        Alert.alert("Error", `Supabase error: ${error.message}`);
        setLoading(false);
        return;
      }
  
      Alert.alert(
        "Account Scheduled",
        `Your account is scheduled for deletion on ${twoWeeksFromNow.toLocaleDateString()}.`
      );
  
      await supabase.auth.signOut();
      router.replace("/login");
    };
  
    if (Platform.OS === "web") {
      // Fallback confirm for web
      const confirmed = window.confirm(
        "This will schedule your account for deletion in 14 days. Proceed?"
      );
      if (confirmed) {
        await confirmAndDelete();
      }
    } else {
      Alert.alert(
        "Delete Account",
        "This will schedule your account for deletion in 14 days. You can cancel by logging in before then. Proceed?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: confirmAndDelete,
          },
        ]
      );
    }
  }
  
  async function cancelDeletion() {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ marked_for_deletion_at: null })
      .eq("id", session?.user?.id);

    if (error) {
      Alert.alert("Error", "Failed to cancel deletion.");
    } else {
      setDeletionDate(null);
      Alert.alert("Account Restored", "Your account deletion has been cancelled.");
    }

    setLoading(false);
  }

  if (!mounted || session === undefined) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
      <View style={styles.asciiContainer}>
  <Text style={styles.ascii} selectable={false}>
    {`
   GGGG   OOO   OOO  DDDD   BBBB   Y   Y  EEEEE
  G      O   O O   O D   D  B   B   Y Y   E    
  G  GG  O   O O   O D   D  BBBB     Y    EEEE 
  G   G  O   O O   O D   D  B   B    Y    E    
   GGGG   OOO   OOO  DDDD   BBBB     Y    EEEEE
    `}
  </Text>
</View>

        <Text style={styles.title}>Account Termination</Text>

        {deletionDate && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Your account is scheduled for deletion on {deletionDate}.
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelDeletion}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel Deletion</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/settings/profile")}
        >
          <Text style={styles.buttonText}>← Back to Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  content: {
    maxWidth: 360,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontFamily: "Courier",
    fontSize: 18,
    color: "#00FF00",
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    borderColor: "#00FF00",
    borderWidth: 1,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: "center",
  },
  deleteButton: {
    borderColor: "red",
    borderWidth: 1,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: "center",
  },
  cancelButton: {
    borderColor: "#00FF00",
    borderWidth: 1,
    paddingVertical: 6,
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Courier",
    fontSize: 16,
    color: "#00FF00",
  },
  warningBox: {
    borderColor: "red",
    borderWidth: 1,
    padding: 12,
    marginBottom: 24,
    backgroundColor: "#220000",
  },
  warningText: {
    fontFamily: "Courier",
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
  asciiContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  
  ascii: {
    fontFamily: "Courier",      // Must be monospaced!
    fontSize: 12,
    color: "#00FF00",
    textAlign: "left",
    lineHeight: 16,
    whiteSpace: "pre",          // Ensures spacing is preserved (important for web)
  },  
});
