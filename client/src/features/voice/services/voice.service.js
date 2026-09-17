import api from "../../../services/api";

const voiceService = {
  submitVoiceAnswer: async (interviewId, audioBlob) => {
    const formData = new FormData();

    formData.append("audio", audioBlob, "answer.webm");

    const response = await api.post(
      `/voice/interviews/${interviewId}/answer`,
      formData,
    );

    return response.data;
  },

  transcribe: async (audioBlob) => {
    const formData = new FormData();

    formData.append("audio", audioBlob, "answer.webm");

    const response = await api.post("/voice/transcribe", formData);

    return response.data;
  },

  startSession: async (interviewId) => {
    const response = await api.post(`/voice/interviews/${interviewId}/session`);

    return response.data;
  },

  getSession: async (interviewId) => {
    const response = await api.get(`/voice/interviews/${interviewId}/session`);

    return response.data;
  },

  stopSession: async (interviewId) => {
    const response = await api.delete(
      `/voice/interviews/${interviewId}/session`,
    );

    return response.data;
  },
};

export default voiceService;
