import { StyleSheet, Text, View } from "react-native";

const newsItems = [
  { title: "Project Pwned In Development", date: "2025-04-21" },
  { title: "Demo Missions Teased", date: "2025-05-01" },
  { title: "Multiplayer Delayed", date: "2025-05-03" },
];

export default function NewsSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Latest News</Text>
      {newsItems.map((item, index) => (
        <View key={index} style={styles.newsItem}>
          <Text style={styles.date}>[{item.date}]</Text>
          <Text style={styles.text}> {item.title}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    width: "90%",
    backgroundColor: "#000",
    padding: 10,
    borderColor: "#00FF00",
    borderWidth: 1,
  },
  header: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 18,
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  newsItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  date: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 14,
  },
  text: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 14,
  },
});
