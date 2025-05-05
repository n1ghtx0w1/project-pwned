import { ScrollView, StyleSheet, Text } from "react-native";

export default function PrivacyPage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.section}>
        This Privacy Policy describes how Project Pwned collects and uses your data when you play.
      </Text>

      <Text style={styles.header}>1. Information We Collect</Text>
      <Text style={styles.section}>
        - Email and username
        {"\n"}- Device identifiers
        {"\n"}- Gameplay stats (e.g., scores, progress)
        {"\n"}We do NOT collect location, contacts, or payments.
      </Text>

      <Text style={styles.header}>2. How We Use It</Text>
      <Text style={styles.section}>
        To manage your account, improve gameplay, detect abuse, and reset your password when needed.
      </Text>

      <Text style={styles.header}>3. Sharing</Text>
      <Text style={styles.section}>
        We do not sell your data. We only share when required by law or to protect users.
      </Text>

      <Text style={styles.header}>4. Storage</Text>
      <Text style={styles.section}>
        We store data securely with Supabase. You may request account deletion at any time.
      </Text>

      <Text style={styles.header}>5. Children</Text>
      <Text style={styles.section}>
        We do not collect data from children under 13 without parental consent.
      </Text>

      <Text style={styles.header}>6. Changes</Text>
      <Text style={styles.section}>
        We may update this policy. Continued use of the game means you accept the changes.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Courier",
    color: "#00FF00",
    marginBottom: 20,
  },
  header: {
    fontSize: 16,
    fontFamily: "Courier",
    color: "#00FF00",
    marginTop: 20,
  },
  section: {
    fontSize: 14,
    fontFamily: "Courier",
    color: "#00FF00",
    marginTop: 8,
  },
});
