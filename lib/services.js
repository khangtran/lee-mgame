import { RequestURL } from "./http";

const domain = "https://loyalty.leecafeteria.net";
const domainAuthen = "https://auth.leecafeteria.net";

const route_loyalty = "/api/loyalty";
const route_authen = "/api/User";

const domain_test = "https://localhost:4300";

export const Services = {
  async login(name, pwd, remember) {
    let endpoint = "/SignIn";
    let url = domainAuthen + route_authen + endpoint;
    let request = new RequestURL(url, "post", {
      Username: name,
      Password: pwd,
      IsRemember: remember
    });
    let result = await request.execute();
    return result;
  },

  async register(email, phone, name, pass) {
    let endpoint = "/SignUp";
    let url = domainAuthen + route_authen + endpoint;
    let request = new RequestURL(url, "post", {
      email: email,
      username: name,
      phoneNumber: phone,
      password: pass
    });
    let result = await request.execute();
    return result;
  },

  async getProfile() {
    let endpoint = "/me";
    let url = domainAuthen + route_authen + endpoint;
    let request = new RequestURL(url, "get");
    request.authen();
    let result = await request.execute();
    return result;
  },

  async getLeePoint(userid) {
    let endpoint = `/Point?userId=${userid}`;
    let url = domain + route_loyalty + endpoint;
    let request = new RequestURL(url, "get");
    request.authen();

    let result = await request.execute();
    return result;
  },

  async doReward(sender, receiver, amount, description) {
    let endpoint = `/Reward`;
    let url = domain + route_loyalty + endpoint;

    let request = new RequestURL(url, "post", {
      sender: sender,
      receiver: receiver,
      amount: amount,
      description: description
    });
    request.authen();
    let result = await request.execute();
    return result;
  },

  async doPayment(sender, receiver, amount, description) {
    let endpoint = `/payment`;
    let url = domain + route_loyalty + endpoint;

    let request = new RequestURL(url, "post", {
      sender: sender,
      receiver: receiver,
      amount: amount,
      description: description
    });
    request.authen();
    let result = await request.execute();
    return result;
  },

  async uploadWave(data) {
    let endpoint = `/api/v1/upload/wave`;
    let url = domain_test + endpoint;

    let request = new RequestURL(url, "post", { data: data, key: Date.now() });
    let result = await request.execute();
    return result;
  }
};
