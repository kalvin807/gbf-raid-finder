import axios from "axios";

const backend = axios.create({
  baseURL: `https://${process.env.VUE_APP_BACKEND_URI}`,
  timeout: 10000,
});

export const get = async (dir, fileName) => {
  try {
    const res = await backend.get(`${dir}/${fileName}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const makeImgUrls = (dir, filename) => ({
  webp: `/img/${dir}/${filename}.webp`,
  jpg: `/img/${dir}/${filename}.jpg`,
});
