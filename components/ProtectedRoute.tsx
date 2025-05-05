import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSession } from "../lib/sessionContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (session === undefined) return; // still initializing
    if (!session?.user?.id) {
      router.replace("/login");
    } else {
      setChecking(false); // valid session found
    }
  }, [session]);

  if (checking || session === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <ActivityIndicator size="large" color="#00FF00" />
      </View>
    );
  }

  return <>{children}</>;
}
