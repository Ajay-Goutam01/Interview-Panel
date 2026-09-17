import { useCallback, useEffect, useState } from "react";

import profileService from "../services/profile.service";

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await profileService.getProfile();

      setProfile(response.data.user);
      return response.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to load your profile.";

      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
  };
};

export default useProfile;
