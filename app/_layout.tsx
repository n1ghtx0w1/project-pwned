import { router, Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SessionProvider, useSession } from "../lib/sessionContext";
import { supabase } from "../lib/supabase";

function Navigation() {
  const pathname = usePathname();
  const { session } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
  
    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        supabase.auth.signOut().then(() => {
          router.replace("/login");
        });
      }, 10 * 60 * 1000); // 10 minutes
    };
  
    const events = ["mousemove", "keydown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // start on load
  
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timeout);
    };
  }, []);  

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => router.push("/")}>
        <Text style={styles.navTitle}>Project Pwned</Text>
      </TouchableOpacity>

      <View style={styles.navLinks}>
        <TouchableOpacity onPress={() => router.push("/news")}>
          <Text style={styles.navLink}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/about")}>
          <Text style={styles.navLink}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/contact")}>
          <Text style={styles.navLink}>Contact</Text>
        </TouchableOpacity>

        {!session ? (
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.navLink}>Login</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity onPress={() => router.push("/settings/profile")}>
              <Text style={styles.navLink}>Settings</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <View style={styles.pageContainer}>
      <SessionProvider>
        <Navigation />
        <View style={styles.mainContent}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </SessionProvider>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 HeadGames</Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => router.push("/terms")}>
            <Text style={styles.footerLink}>Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/privacy")}>
            <Text style={styles.footerLink}>Privacy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  navbar: {
    height: 60,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ✅ ensures left/right layout
    borderBottomWidth: 1,
    borderBottomColor: "#00FF00",
  },  
  navTitle: {
    color: "#00FF00",
    fontSize: 20,
    fontFamily: "Courier",
  },
  navLinks: {
    flexDirection: "row",
  },
  navLink: {
    color: "#00FF00",
    fontSize: 16,
    fontFamily: "Courier",
    marginLeft: 20, // ✅ properly spaces links horizontally
  },
  mainContent: {
    flex: 1,
  },
  footer: {
    height: 50,
    borderTopWidth: 1,
    borderTopColor: "#00FF00",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#00FF00",
    fontSize: 12,
    fontFamily: "Courier",
  },
  footerLinks: {
    flexDirection: "row",
    gap: 16, // optional for web, or use marginLeft
    marginTop: 4,
  },
  footerLink: {
    color: "#00FF00",
    fontFamily: "Courier",
    fontSize: 12,
    marginLeft: 16, // ✅ works on native
    textDecorationLine: "underline",
  },  
});
