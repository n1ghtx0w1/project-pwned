import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#00FF00",
        backgroundColor: "#000",
        borderColor: "#00FF00",
        borderWidth: 1,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontFamily: "Courier",
        color: "#00FF00",
      }}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#00FF00",
        backgroundColor: "#000",
        borderColor: "#00FF00",
        borderWidth: 1,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontFamily: "Courier",
        color: "#00FF00",
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "red",
        backgroundColor: "#000",
        borderColor: "red",
        borderWidth: 1,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontFamily: "Courier",
        color: "red",
      }}
    />
  ),
};
