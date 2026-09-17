import api from "../../../services/api";

const resumeService = {
  getResumes: async () => {
    const response = await api.get("/resume");
    return response.data;
  },

  getResume: async (id) => {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();

    formData.append("resume", file);

    const response = await api.post("/resume", formData);

    return response.data;
  },

  processResume: async (id) => {
    const response = await api.post(`/resume/${id}/process`);
    return response.data;
  },

  deleteResume: async (id) => {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
  },
};

export default resumeService;
