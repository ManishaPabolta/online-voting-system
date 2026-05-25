import AppRoutes from "./routes/AppRoutes";

import AuthProvider from "./context/AuthContext";

import SocketProvider from "./context/SocketContext";

import NotificationProvider from "./context/NotificationContext";

import { Toaster } from "react-hot-toast";

function App() {

  return (

    <AuthProvider>

      <SocketProvider>

        <NotificationProvider>

          {/* ROUTES */}

          <AppRoutes />

          {/* TOASTER */}

          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,

              style: {
                background: "#0f172a",
                color: "#ffffff",
                border:
                  "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
              },
            }}
          />

        </NotificationProvider>

      </SocketProvider>

    </AuthProvider>
  );
}

export default App;