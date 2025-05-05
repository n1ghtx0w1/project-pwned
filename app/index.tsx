import { StyleSheet, Text, View } from "react-native";

export default function LandingPage() {
  return (
    <View style={styles.container}>
    <View style={styles.asciiContainer}>
    <Text style={styles.asciiArt}>
{`
              ,---------------------------,
              |  /---------------------\\  |
              | |                       | |
              | |   Project             | |
              | |     Pwned             | |
              | |                       | |
              |  \\_____________________/  |
              |___________________________|
            ,---\\_____     []     _______/------,
          /         /______________\\           /|
        /___________________________________ /  | ___
        |                                   |   |    )
        |  _ _ _                 [-------]  |   |   (
        |  o o o                 [-------]  |  /    _)_
        |__________________________________ |/     /  /
    /-------------------------------------/|      ( )/
  /-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ /
/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ /
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
`}
  </Text>
</View>
      <Text style={styles.title}>HeadGames Presents</Text>
      <Text style={styles.subtitle}>Project Pwned</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#00FF00",
    fontSize: 32,
    fontFamily: "Courier",
    marginBottom: 10,
  },
  subtitle: {
    color: "#00FF00",
    fontSize: 18,
    fontFamily: "Courier",
  },
  asciiContainer: {
    marginVertical: 24,
    paddingHorizontal: 10,
  },
  asciiArt: {
    fontFamily: "Courier",
    color: "#00FF00",
    fontSize: 10,
    lineHeight: 12,
    textAlign: "left",
  },
});
