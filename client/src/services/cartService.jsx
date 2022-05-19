const cartService = {
  getAllCartItem: async (token) => {
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/cart/`, {
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
  addToCart: async (productObj, token) => {
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/cart/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productObj),
      });
      const response = await request.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  decreaseOne: async (orderId, token) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_API}/cart/decrease/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await request.json();
      return response;
    } catch (err) {
      console.log(err);
    }
  },
  removeFromCart: async (orderId, token) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_API}/cart/delete/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
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

export default cartService;
