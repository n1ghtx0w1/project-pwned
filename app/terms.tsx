import { ScrollView, StyleSheet, Text } from "react-native";

export default function TermsPage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>

      <Text style={styles.section}>
        Welcome to Project Pwned. By using our game, you agree to these Terms of Service.
        If you do not agree, please do not use the game.
      </Text>

      <Text style={styles.header}>1. Use of the Game</Text>
      <Text style={styles.section}>
        You may only use Project Pwned for personal, non-commercial entertainment purposes.
        You must be at least 13 years old or have permission from a parent or guardian.
      </Text>

      <Text style={styles.header}>2. Account Responsibility</Text>
      <Text style={styles.section}>
        You are responsible for maintaining the confidentiality of your login credentials.
        Do not share your account. Contact us if you suspect unauthorized access.
      </Text>

      <Text style={styles.header}>3. Conduct</Text>
      <Text style={styles.section}>
        You agree not to:
        {"\n"}- Cheat or exploit bugs
        {"\n"}- Harass other players
        {"\n"}- Attempt to hack or modify the game
      </Text>

      <Text style={styles.header}>4. Game Content</Text>
      <Text style={styles.section}>
        All game assets are owned by Project Pwned or its licensors. You may not redistribute content.
      </Text>

      <Text style={styles.header}>5. Availability</Text>
      <Text style={styles.section}>
        We may change or shut down the game at any time. We are not responsible for data loss or downtime.
      </Text>

      <Text style={styles.header}>6. Disclaimer</Text>
      <Text style={styles.section}>
        Project Pwned is provided "as is" without warranties. We are not liable for any losses or damages.
      </Text>

      <Text style={styles.header}>7. Changes to Terms</Text>
      <Text style={styles.section}>
        We may update these Terms at any time. By continuing to use the game, you accept the changes.
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
