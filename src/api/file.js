import api from "../libs/axios";

export const upload = async (files) => {
  return await api.post(`/file/upload`, files, { headers: { "Content-Type": "multipart/form-data" } });
};
