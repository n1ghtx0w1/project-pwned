import { StyleSheet, Text, View } from "react-native";

export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.ascii}>
{`
 CCCCC   OOO   N   N  TTTTT  AAAAA  CCCCC  TTTTT
C       O   O  NN  N    T   A     A C        T  
C       O   O  N N N    T   A A A A C        T  
C       O   O  N  NN    T   A     A C        T  
 CCCCC   OOO   N   N    T   A     A  CCCCC   T  
`}
      </Text>
      <Text style={styles.text}>Have questions or suggestions?</Text>
      <Text style={styles.text}>Future contact info:</Text>
      <Text style={styles.text}>📧 Email: TBD</Text>
      <Text style={styles.text}>💬 Discord: TBD</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#00FF00",
    fontSize: 24,
    fontFamily: "Courier",
    marginBottom: 20,
    textAlign: "center",
  },
  ascii: {
    fontFamily: "Courier",
    color: "#00FF00",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  text: {
    color: "#00FF00",
    fontSize: 16,
    fontFamily: "Courier",
    marginBottom: 10,
    textAlign: "left",
  },
});
