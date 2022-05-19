const groupOrderService = {
  getAllItemInGroup: async (groupId, token) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_API}/order/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await request.json();
      return response;
    } catch (error) {}
  },
  createGroup: async (token) => {
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/order/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await request.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  preCheck: async (token) => {
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/order/group`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await request.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  joinTheGroupOrder: async (groupId, chatroomId, token) => {
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/order/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId: groupId, chatroomId }),
      });
      const response = await request.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  checkJoinedGroup: async (token) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_API}/order/joinedgroup`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await request.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  leaveTheGroup: async (token) => {
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/order/leave`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await request.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  deleteThisGroup: async (orderId, token) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_API}/order/delete/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await request.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  toggleGroupStatus: async (orderId, orderStatus, token) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_API}/order/orderstatus/${orderId}/${orderStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await request.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  },
};

export default groupOrderService;
