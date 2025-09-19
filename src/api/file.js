import api from "../libs/axios";

export const upload = async (files, setUploadProgress) => {
  return await api.post(`/file/upload`, files, {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percentCompleted = Math.floor((loaded * 100) / total);
      setUploadProgress(percentCompleted);
      // console.log(`Upload progress: ${percentCompleted}%`);
      // You can update a state variable or a UI element here to display the progress
    },
    headers: { "Content-Type": "multipart/form-data" },
  });
};
