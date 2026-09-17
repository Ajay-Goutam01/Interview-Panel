import api from "../../../services/api";

const interviewService = {
  getInterviews: async () => {
    const response = await api.get("/interviews");

    return response.data;
  },

  getInterview: async (id) => {
    const response = await api.get(`/interviews/${id}`);

    return response.data;
  },

  createInterview: async (interviewData) => {
    const response = await api.post("/interviews", interviewData);

    return response.data;
  },

  startInterview: async (id) => {
    const response = await api.post(`/interviews/${id}/start`);

    return response.data;
  },

  submitAnswer: async (id, answerData) => {
    const response = await api.post(`/interviews/${id}/answer`, answerData);

    return response.data;
  },
};

export default interviewService;
