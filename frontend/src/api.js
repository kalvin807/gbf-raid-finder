import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.1.30:8080/",
  timeout: 1000,
});

export const get = async (dir, fileName) => {
  try {
    const res = await instance.get(`${dir}/${fileName}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
