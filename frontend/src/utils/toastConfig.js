import toast from "react-hot-toast";

export const successToast =
  (message) => {
    toast.success(message, {
      style: {
        background:
          "#0f172a",
        color: "#fff",
        border:
          "1px solid #2563eb",
      },
    });
  };

export const errorToast = (
  message
) => {
  toast.error(message, {
    style: {
      background:
        "#0f172a",
      color: "#fff",
      border:
        "1px solid #ef4444",
    },
  });
};