import {
  createContext,
  useEffect,
  useState,
} from "react";

import io from "socket.io-client";

export const SocketContext =
  createContext();

const socket = io(
  import.meta.env.VITE_SOCKET_URL
);

const SocketProvider = ({
  children,
}) => {
  const [
    connected,
    setConnected,
  ] = useState(false);

  useEffect(() => {
    socket.on(
      "connect",
      () => {
        setConnected(true);

        console.log(
          "Socket Connected"
        );
      }
    );

    socket.on(
      "disconnect",
      () => {
        setConnected(false);

        console.log(
          "Socket Disconnected"
        );
      }
    );

    return () => {
      socket.off(
        "connect"
      );

      socket.off(
        "disconnect"
      );
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;