import API from "./axios";

export const sendMessage =
  async (messageData) => {
    const response =
      await API.post(
        "/support/send",
        messageData
      );

    return response.data;
  };

export const getMessages =
  async () => {
    const response =
      await API.get(
        "/support/messages"
      );

    return response.data;
  };

export const closeChat =
  async (chatId) => {
    const response =
      await API.put(
        `/support/close/${chatId}`
      );

    return response.data;
  };