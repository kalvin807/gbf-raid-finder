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

export const makeImgUrl = (filename) =>
  `${process.env.VUE_APP_GITHUB_DIR}${filename}`;
