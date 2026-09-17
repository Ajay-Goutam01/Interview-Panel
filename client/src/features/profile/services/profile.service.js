import api from "../../../services/api";

const profileService = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.patch("/users/profile", profileData);

    return response.data;
  },
};

export default profileService;
