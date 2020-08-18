import axios from "axios";

const instance = axios.create({
  baseURL: `https://${process.env.VUE_APP_BACKEND_URI}`,
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
