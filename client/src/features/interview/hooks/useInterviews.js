import { useCallback, useEffect, useState } from "react";

import interviewService from "../services/interview.service";

const useInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await interviewService.getInterviews();

      const data = response.data?.interviews || [];

      setInterviews(Array.isArray(data) ? data : []);

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to load your interviews.";

      setError(message);

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  return {
    interviews,
    loading,
    error,
    fetchInterviews,
  };
};

export default useInterviews;
