const chatService = {
  getChatroom: async (token, chatroomId) => {
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/chatroom/${chatroomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await request.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  sendMessage: async (messageObj, token) => {
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/chatroom/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageObj),
      });
      const response = await request.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
};

export default chatService;
