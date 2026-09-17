import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Navbar from "../../../components/layout/Navbar";

import resumeService from "../../resume/services/resume.service";
import interviewService from "../services/interview.service";

const CreateInterviewPage = () => {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);

  const [formData, setFormData] = useState({
    resumeId: "",
    interviewType: "full",
    difficulty: "medium",
    language: "hinglish",
  });

  const [loadingResumes, setLoadingResumes] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumes = async () => {
      setLoadingResumes(true);
      setError("");

      try {
        const response = await resumeService.getResumes();

        const data = response.data?.resumes || [];

        setResumes(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load your resumes.",
        );
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchResumes();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.resumeId) {
      setError("Please select a processed resume.");
      return;
    }

    setCreating(true);

    try {
      const response = await interviewService.createInterview(formData);

      const interview = response.data?.interview || response.data;

      const interviewId = interview?._id || interview?.id;

      if (!interviewId) {
        throw new Error("Interview was created but ID was not returned.");
      }

      navigate(`/interview/${interviewId}`);
    } catch (error) {
      const errors = error.response?.data?.errors;

      if (Array.isArray(errors) && errors.length > 0) {
        setError(errors.join(" "));
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to create interview.",
        );
      }
    } finally {
      setCreating(false);
    }
  };

  const processedResumes = resumes.filter(
    (resume) => resume.status === "processed",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <div className="mx-auto max-w-3xl px-6 py-8 lg:px-8">
          {/* Header */}
          <div>
            <p className="text-sm font-medium text-purple-600">Interview</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Create an Interview
            </h1>

            <p className="mt-2 text-gray-500">
              Configure your AI-powered interview based on your resume.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Card className="mt-6 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resume */}
              <div>
                <label
                  htmlFor="resumeId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Resume
                </label>

                <select
                  id="resumeId"
                  name="resumeId"
                  value={formData.resumeId}
                  onChange={handleChange}
                  disabled={loadingResumes || creating}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="">
                    {loadingResumes
                      ? "Loading resumes..."
                      : "Select a processed resume"}
                  </option>

                  {processedResumes.map((resume) => {
                    const resumeId = resume._id || resume.id;

                    const name =
                      resume.originalFileName ||
                      resume.originalName ||
                      resume.fileName ||
                      "Resume";

                    return (
                      <option key={resumeId} value={resumeId}>
                        {name}
                      </option>
                    );
                  })}
                </select>

                {!loadingResumes && processedResumes.length === 0 && (
                  <p className="mt-2 text-xs text-orange-600">
                    You need a processed resume before starting an interview.
                  </p>
                )}
              </div>

              {/* Interview Type */}
              <div>
                <label
                  htmlFor="interviewType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Interview Type
                </label>

                <select
                  id="interviewType"
                  name="interviewType"
                  value={formData.interviewType}
                  onChange={handleChange}
                  disabled={creating}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="full">Full Interview</option>

                  <option value="hr">HR Interview</option>

                  <option value="technical">Technical Interview</option>

                  <option value="behavioral">Behavioral Interview</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700"
                >
                  Difficulty
                </label>

                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  disabled={creating}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="easy">Easy</option>

                  <option value="medium">Medium</option>

                  <option value="hard">Hard</option>

                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700"
                >
                  Interview Language
                </label>

                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  disabled={creating}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="english">English</option>

                  <option value="hindi">Hindi</option>

                  <option value="hinglish">Hinglish</option>
                </select>
              </div>

              {/* Info */}
              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-sm font-medium text-purple-900">
                  AI-powered interview
                </p>

                <p className="mt-1 text-sm leading-6 text-purple-700">
                  Your processed resume, skills, projects and extracted claims
                  will be used to personalize the interview.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={creating}
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={creating}
                  disabled={
                    loadingResumes ||
                    processedResumes.length === 0 ||
                    !formData.resumeId
                  }
                >
                  Create Interview
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateInterviewPage;
