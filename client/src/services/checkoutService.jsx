const checkoutSevices = {
  groupCheckout: async (submitBody, orderId, token) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_API}/payment/group-checkout/${orderId}`,
        {
          method: "POST",
          body: JSON.stringify({ ...submitBody }),
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
  sendMail: async (body, token) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_API}/payment/sendmail`,
        {
          method: "POST",
          body: JSON.stringify({ ...body }),
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

export default checkoutSevices;
