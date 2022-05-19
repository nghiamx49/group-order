const authenticateService = {
  login: async ({ username, password }) => {
    let request = await fetch(`${process.env.REACT_APP_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    let response = await request.json();
    return response;
  },

  register: async (obj) => {
    let request = await fetch(`${process.env.REACT_APP_API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    let response = await request.json();
    return response;
  },
};

export default authenticateService;
