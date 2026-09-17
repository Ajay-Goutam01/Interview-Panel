import { useCallback, useEffect, useState } from "react";

import resumeService from "../services/resume.service";

const useResume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await resumeService.getResumes();

      const resumes = response.data?.resumes || [];

      setResumes(resumes);

      return resumes;
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to load your resumes.";

      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  return {
    resumes,
    loading,
    error,
    fetchResumes,
  };
};

export default useResume;
