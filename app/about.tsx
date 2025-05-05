import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
              <Text style={styles.ascii}>
{`
 AAAAA   BBBB    OOO   U   U  TTTTT
A     A  B   B  O   O  U   U    T  
A A A A  BBBB   O   O  U   U    T  
A     A  B   B  O   O  U   U    T  
A     A  BBBB    OOO    UUU     T  
`}
      </Text>
      <Text style={styles.title}></Text>
      <Text style={styles.text}>
        Project Pwned is an educational hacking aracde style app.
        Players learn security concepts through realistic missions and interactive scenarios.
        Designed for cyber enthusiasts.
      </Text>
      <Text style={styles.text}>
        Created with ❤️ by HeadGames. Stay sharp, stay ethical, and never q!
      </Text>
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
