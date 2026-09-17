import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Navbar from "../../../components/layout/Navbar";

import resumeService from "../services/resume.service";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ResumePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [resumes, setResumes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [processingId, setProcessingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchResumes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await resumeService.getResumes();

      const data = response.data?.resumes ?? [];

      setResumes(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load your resumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const validateFile = (file) => {
    if (!file) {
      return "Please select a resume.";
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only PDF, DOC, and DOCX files are allowed.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Resume size cannot exceed 5 MB.";
    }

    return "";
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    setError("");
    setSuccess("");

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      await resumeService.uploadResume(file);

      setSuccess("Resume uploaded successfully.");

      await fetchResumes();
    } catch (error) {
      const errors = error.response?.data?.errors;

      if (Array.isArray(errors) && errors.length > 0) {
        setError(errors.join(" "));
      } else {
        setError(
          error.response?.data?.message || "Unable to upload your resume.",
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleProcess = async (resumeId) => {
    setProcessingId(resumeId);
    setError("");
    setSuccess("");

    try {
      await resumeService.processResume(resumeId);

      setSuccess("Resume processing started successfully.");

      await fetchResumes();
    } catch (error) {
      const errors = error.response?.data?.errors;

      if (Array.isArray(errors) && errors.length > 0) {
        setError(errors.join(" "));
      } else {
        setError(
          error.response?.data?.message || "Unable to process your resume.",
        );
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (resumeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) return;

    setDeletingId(resumeId);
    setError("");
    setSuccess("");

    try {
      await resumeService.deleteResume(resumeId);

      setResumes((previous) =>
        previous.filter((resume) => (resume._id || resume.id) !== resumeId),
      );

      setSuccess("Resume deleted successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to delete your resume.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getFileName = (resume) => {
    return resume.originalName || resume.fileName || resume.name || "Resume";
  };

  const getResumeStatus = (resume) => {
    return resume.status || "uploaded";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
          {/* Header */}
          <div>
            <p className="text-sm font-medium text-purple-600">Resume</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Manage your resume
            </h1>

            <p className="mt-2 text-gray-500">
              Upload your resume so AI can personalize your interview
              experience.
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Upload */}
          <Card className="mt-6 p-8">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                📄
              </div>

              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                Upload your resume
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Upload your latest resume in PDF, DOC, or DOCX format.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                type="button"
                loading={uploading}
                onClick={handleUploadClick}
                className="mt-6"
              >
                Choose Resume
              </Button>

              <p className="mt-3 text-xs text-gray-400">
                Maximum file size: 5 MB
              </p>
            </div>
          </Card>

          {/* Resume List */}
          <Card className="mt-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Your resumes
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your uploaded resumes.
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}
              </span>
            </div>

            {/* Loading */}
            {loading && (
              <div className="mt-6 rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center">
                <p className="text-sm text-gray-400">Loading resumes...</p>
              </div>
            )}

            {/* Empty */}
            {!loading && resumes.length === 0 && (
              <div className="mt-6 rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center">
                <p className="text-sm font-medium text-gray-500">
                  No resume uploaded yet
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Upload your resume to get started.
                </p>
              </div>
            )}

            {/* Resumes */}
            {!loading && resumes.length > 0 && (
              <div className="mt-6 space-y-3">
                {resumes.map((resume) => {
                  const resumeId = resume._id || resume.id;

                  const status = getResumeStatus(resume);

                  return (
                    <div
                      key={resumeId}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* File Info */}
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-sm">
                            📄
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {getFileName(resume)}
                            </p>

                            <p className="mt-1 text-xs capitalize text-gray-400">
                              {status}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                          {/* Process */}
                          {status === "uploaded" && (
                            <Button
                              size="sm"
                              loading={processingId === resumeId}
                              onClick={() => handleProcess(resumeId)}
                            >
                              Process
                            </Button>
                          )}

                          {/* Processing */}
                          {status === "processing" && (
                            <span className="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-700">
                              Processing...
                            </span>
                          )}

                          {/* Processed */}
                          {status === "processed" && (
                            <>
                              <span className="rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                                Processed
                              </span>

                              <Button
                                size="sm"
                                onClick={() =>
                                  navigate(`/resume/${resumeId}/analysis`)
                                }
                              >
                                View Analysis
                              </Button>
                            </>
                          )}

                          {/* Failed */}
                          {status === "failed" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              loading={processingId === resumeId}
                              onClick={() => handleProcess(resumeId)}
                            >
                              Retry
                            </Button>
                          )}

                          {/* Delete */}
                          <Button
                            size="sm"
                            variant="danger"
                            loading={deletingId === resumeId}
                            onClick={() => handleDelete(resumeId)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResumePage;
