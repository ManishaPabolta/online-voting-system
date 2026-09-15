import toast from "react-hot-toast";

const toastStyle = {
  background: "#0f172a",
  color: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid rgba(16, 185, 129, 0.35)",
  padding: "12px 16px",
  boxShadow:
    "0 10px 30px rgba(0, 0, 0, 0.25)",
};

export const successToast = (message) => {
  toast.success(message, {
    duration: 3000,
    style: toastStyle,
    iconTheme: {
      primary: "#10b981",
      secondary: "#ffffff",
    },
  });
};

export const errorToast = (message) => {
  toast.error(message, {
    duration: 3500,
    style: {
      ...toastStyle,
      border:
        "1px solid rgba(239, 68, 68, 0.4)",
    },
    iconTheme: {
      primary: "#ef4444",
      secondary: "#ffffff",
    },
  });
};