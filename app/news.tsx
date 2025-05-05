import { StyleSheet, Text, View } from "react-native";
import NewsSection from "../components/NewsSection";

export default function NewsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.ascii}>
{`
NN   N  EEEEE  W     W  SSSS
N N  N  E      W     W  S   
N  N N  EEEE   W  W  W   SSS
N   NN  E      W W W W      S
N    N  EEEEE   W   W   SSSS
`}
      </Text>
      <NewsSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  ascii: {
    fontFamily: "Courier",
    color: "#00FF00",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
});
