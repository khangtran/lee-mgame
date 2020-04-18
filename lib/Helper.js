import jwtdecode from "jwt-decode";

export class Helper {
  static getProfile() {
    let token = sessionStorage.getItem("@token");
    let profile = sessionStorage.getItem("@authen");
    if (profile === null) {
      return null;
    }

    let json = JSON.parse(profile);
    ProfileInstance = new Account(json);
    ProfileInstance.userid = jwtdecode(token).nameid;
    return ProfileInstance;
  }
}

export class Account {
  constructor(json) {
    this.userid = "";
    this.username = json.userName;
    this.point = json.point;
    this.email = json.email;
    this.phone = json.phoneNumber;
    this.phone_confirmed = json.phoneNumberConfirmed;
  }
}

export var ProfileInstance = new Account({});
