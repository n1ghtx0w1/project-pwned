import { Session, SupabaseClient } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message"; //
import { supabase } from "./supabase";

interface SessionContextType {
  session: Session | null;
  client: SupabaseClient;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        attachListeners();
        resetTimer();
      }
    });
    
        // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        resetTimer(); // ✅ Also start timers here after login
      } else {
        clearTimeout(warnTimeout);
        clearTimeout(logoutTimeout);
      }
    });

    // ✅ Inactivity timer setup
    let warnTimeout: NodeJS.Timeout;
    let logoutTimeout: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(warnTimeout);
      clearTimeout(logoutTimeout);
    
      // 🔔 Show warning 30 seconds before logout
      warnTimeout = setTimeout(() => {
        Toast.show({
          type: "info",
          text1: "You will be logged out in 30 seconds due to inactivity.",
          position: "bottom",
          visibilityTime: 4000,
        });
      }, 9.5 * 60 * 1000); // 9 min 30 sec
    
      // 🔴 Full logout
      logoutTimeout = setTimeout(() => {
        Toast.show({
          type: "info",
          text1: "Logged out due to inactivity",
          position: "bottom",
          visibilityTime: 4000,
        });
    
        supabase.auth.signOut().then(() => {
          requestAnimationFrame(() => {
            try {
              router.replace("/login");
            } catch (err) {
              console.warn("Navigation error on inactivity logout:", err);
            }
          });
        });
      }, 10 * 60 * 1000); // 10 min
    };    
    
    const events = ["mousemove", "keydown", "touchstart"];

    const attachListeners = () => {
      events.forEach((event) => document.addEventListener(event, resetTimer));
    };
    
    const detachListeners = () => {
      events.forEach((event) => document.removeEventListener(event, resetTimer));
    };    

    return () => {
      listener.subscription.unsubscribe();
      detachListeners();
      clearTimeout(warnTimeout);
      clearTimeout(logoutTimeout);
    };    
    
  }, [router]);

  if (typeof window === "undefined" || !supabase) {
    return null;
  }

  return (
    <SessionContext.Provider value={{ session, client: supabase }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
