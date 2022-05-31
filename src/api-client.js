import axios from "axios";

const rooturl = process.env.rooturl || "http://localhost:8080/";

export default {
  authorize() {
    return axios
      .get(rooturl + "users/authorize", {
        headers: {
          token: "e " + localStorage.getItem("acces_token"),
        },
      })
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        throw error;
      });
  },
  getAllStations() {
    return axios
      .get(rooturl + "stations/all", {})
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        throw error;
      });
  },

  getStationDetails(id) {
    return axios
      .get(rooturl + "stations/details?id=" + id, {
        headers: {
          token: "e " + localStorage.getItem("acces_token"),
        },
      })
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        throw error;
      });
  },

  getStationComments(id) {
    return axios
      .get(rooturl + "stations/comment/get?id=" + id, {})
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        throw error;
      });
  },

  sendGrade(data) {
    //todo catch
    axios
      .post(rooturl + "stations/grade/add", data, {
        headers: {
          Authorization: "e " + localStorage.getItem("acces_token"),
        },
      })
      .catch((error) => {
        throw error;
      });
  },

  updateFuelPrice(data) {
    //todo catch
    return axios
      .post(rooturl + "stations/fuel/edit", data, {
        headers: {
          Authorization: "e " + localStorage.getItem("acces_token"),
        },
      })
      .catch((error) => {
        throw error;
      });
  },

  addComment(data) {
    return axios
      .post(rooturl + "stations/comment/add", data, {
        headers: {
          Authorization: "e " + localStorage.getItem("acces_token"),
        },
      })
      .then((resp) => {})
      .catch((error) => {
        throw error;
      });
  },

  addNewStation(data) {
    return axios
      .post(rooturl + "stations/new", data, {
        headers: {
          Authorization: "e " + localStorage.getItem("acces_token"),
        },
      })
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        throw error;
      });
  },

  register(data) {
    return axios
      .post(rooturl + "users/register", data, {})
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        throw error;
      });
  },
  login(data) {
    return axios
      .post(rooturl + "login", data, {})
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        throw error;
      });
  },
  logout() {
    return axios
      .post(rooturl + "logout", {})
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        throw error;
      });
  },
};
