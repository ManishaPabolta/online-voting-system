import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { io } from "socket.io-client";

export const SocketContext =
  createContext(null);

// ==========================================
// SOCKET URL
// ==========================================

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "https://learning-rbko.onrender.com";

// ==========================================
// SOCKET INSTANCE
// ==========================================

const socket = io(
  SOCKET_URL,
  {
    autoConnect: true,
    withCredentials: true,
    transports: [
      "websocket",
      "polling",
    ],
  }
);

const SocketProvider = ({
  children,
}) => {
  const [
    connected,
    setConnected,
  ] = useState(
    socket.connected
  );

  const [
    connecting,
    setConnecting,
  ] = useState(
    !socket.connected
  );

  const [
    connectionError,
    setConnectionError,
  ] = useState(null);

  // ==========================================
  // SOCKET CONNECTION
  // ==========================================

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
      setConnecting(false);
      setConnectionError(null);

      console.log(
        "Socket Connected:",
        socket.id
      );
    };

    const handleDisconnect = (
      reason
    ) => {
      setConnected(false);
      setConnecting(false);

      console.log(
        "Socket Disconnected:",
        reason
      );
    };

    const handleConnectError = (
      error
    ) => {
      setConnected(false);
      setConnecting(false);

      setConnectionError(
        error?.message ||
          "Socket connection failed."
      );

      console.error(
        "Socket Connection Error:",
        error
      );
    };

    const handleReconnectAttempt =
      () => {
        setConnecting(true);
      };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "connect_error",
      handleConnectError
    );

    socket.io.on(
      "reconnect_attempt",
      handleReconnectAttempt
    );

    if (!socket.connected) {
      setConnecting(true);
      socket.connect();
    }

    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "connect_error",
        handleConnectError
      );

      socket.io.off(
        "reconnect_attempt",
        handleReconnectAttempt
      );
    };
  }, []);

  // ==========================================
  // JOIN USER ROOM
  // ==========================================

  const joinUserRoom = (
    userId
  ) => {
    if (!userId) {
      return;
    }

    if (!socket.connected) {
      socket.once(
        "connect",
        () => {
          socket.emit(
            "join-user-room",
            userId
          );
        }
      );

      socket.connect();

      return;
    }

    socket.emit(
      "join-user-room",
      userId
    );
  };

  // ==========================================
  // JOIN ELECTION ROOM
  // ==========================================

  const joinElectionRoom = (
    electionId
  ) => {
    if (!electionId) {
      return;
    }

    if (!socket.connected) {
      socket.once(
        "connect",
        () => {
          socket.emit(
            "join-election",
            electionId
          );
        }
      );

      socket.connect();

      return;
    }

    socket.emit(
      "join-election",
      electionId
    );
  };

  // ==========================================
  // JOIN SUPPORT ROOM
  // ==========================================

  const joinSupportRoom = (
    roomId
  ) => {
    if (!roomId) {
      return;
    }

    if (!socket.connected) {
      socket.once(
        "connect",
        () => {
          socket.emit(
            "join-support-room",
            roomId
          );
        }
      );

      socket.connect();

      return;
    }

    socket.emit(
      "join-support-room",
      roomId
    );
  };

  // ==========================================
  // SEND NOTIFICATION
  // ==========================================

  const sendNotification = (
    data
  ) => {
    if (!data) {
      return;
    }

    socket.emit(
      "send-notification",
      data
    );
  };

  // ==========================================
  // SEND SUPPORT MESSAGE
  // ==========================================

  const sendSupportMessage = (
    data
  ) => {
    if (!data) {
      return;
    }

    socket.emit(
      "support-message",
      data
    );
  };

  // ==========================================
  // VOTE SOCKET EVENT
  // ==========================================

  /*
    NOTE:
    Actual successful voting should be
    controlled by the backend.

    This function is kept only for compatibility
    with the current socket implementation.
  */

  const notifyVoteCasted = (
    data
  ) => {
    if (!data) {
      return;
    }

    socket.emit(
      "vote-casted",
      data
    );
  };

  // ==========================================
  // LEAVE ROOM
  // ==========================================

  const leaveRoom = (
    roomId
  ) => {
    if (!roomId) {
      return;
    }

    /*
      Socket.IO automatically handles room
      cleanup when the socket disconnects.

      We intentionally don't emit arbitrary
      server events because the current backend
      doesn't expose a leave-room event.
    */
  };

  return (
    <SocketContext.Provider
      value={{
        socket,

        connected,
        connecting,
        connectionError,

        joinUserRoom,
        joinElectionRoom,
        joinSupportRoom,

        sendNotification,
        sendSupportMessage,
        notifyVoteCasted,

        leaveRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

// ==========================================
// CUSTOM SOCKET HOOK
// ==========================================

export const useSocket = () => {
  const context =
    useContext(
      SocketContext
    );

  if (!context) {
    throw new Error(
      "useSocket must be used inside SocketProvider."
    );
  }

  return context;
};