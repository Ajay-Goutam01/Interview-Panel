import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Navbar from "../../../components/layout/Navbar";

import resumeService from "../services/resume.service";

const ResumeAnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      setLoading(true);
      setError("");

      if (!id) {
        setError("Resume ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await resumeService.getResume(id);
        setResume(response.data?.resume || response.data || null);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load resume analysis.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 py-12">
          <Card className="p-10 text-center">
            <p className="text-sm text-gray-500">Loading resume analysis...</p>
          </Card>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 py-12">
          <Card className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <Button className="mt-5" onClick={() => navigate("/resume")}>
              Back to Resume
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  const parsedData = resume.parsedData || {};
  const analysis = resume.aiAnalysis || {};
  const claims = Array.isArray(resume.claims) ? resume.claims : [];

  const score = Number(analysis.overallScore || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                Resume Analysis
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                AI Resume Insights
              </h1>

              <p className="mt-2 text-gray-500">
                AI-powered analysis of your resume and interview readiness.
              </p>
            </div>

            <Button variant="secondary" onClick={() => navigate("/resume")}>
              ← Back
            </Button>
          </div>

          {/* Score */}
          <Card className="mt-6 overflow-hidden p-6">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Overall Resume Score
                </p>

                <h2 className="mt-2 text-5xl font-bold text-gray-900">
                  {score}
                  <span className="text-2xl text-gray-400">/100</span>
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Based on technical strength, projects, skills, achievements
                  and interview readiness.
                </p>
              </div>

              <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-purple-100">
                <span className="text-3xl font-bold text-purple-600">
                  {score}
                </span>
              </div>
            </div>
          </Card>

          {/* Summary */}
          {parsedData.summary && (
            <Card className="mt-6 p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Resume Summary
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {parsedData.summary}
              </p>
            </Card>
          )}

          {/* Skills */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Skills</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {(parsedData.skills || []).map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Education */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Education</h2>

            <div className="mt-4 space-y-4">
              {(parsedData.education || []).map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <h3 className="font-semibold text-gray-900">
                    {item.degree || "Education"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    {item.institution || "Institution not specified"}
                  </p>

                  {item.field && (
                    <p className="mt-1 text-sm text-gray-500">{item.field}</p>
                  )}

                  {item.grade && (
                    <p className="mt-2 text-sm font-medium text-purple-600">
                      {item.grade}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Projects */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Projects</h2>

            <div className="mt-4 space-y-4">
              {(parsedData.projects || []).map((project, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <h3 className="font-semibold text-gray-900">
                    {project.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {project.description}
                  </p>

                  {project.technologies?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Claims */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Resume Claims
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Claims that may be verified during an interview.
            </p>

            <div className="mt-4 space-y-3">
              {claims.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No specific claims identified.
                </p>
              ) : (
                claims.map((claim, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium capitalize text-purple-700">
                        {claim.type}
                      </span>

                      {claim.verificationRequired && (
                        <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">
                          Verification Required
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-700">
                      {claim.text}
                    </p>

                    {claim.metric && (
                      <p className="mt-2 text-xs text-gray-500">
                        Metric: {claim.metric}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Strengths */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Strengths</h2>

            <div className="mt-4 space-y-3">
              {(analysis.strengths || []).map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-lg bg-green-50 p-3"
                >
                  <span className="text-green-600">✓</span>

                  <p className="text-sm text-green-800">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Weaknesses */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Weaknesses</h2>

            <div className="mt-4 space-y-3">
              {(analysis.weaknesses || []).map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-lg bg-red-50 p-3"
                >
                  <span className="text-red-600">!</span>

                  <p className="text-sm text-red-800">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Missing Skills */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recommended Skills
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {(analysis.missingSkills || []).map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recommendations
            </h2>

            <div className="mt-4 space-y-3">
              {(analysis.recommendations || []).map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <p className="text-sm leading-6 text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResumeAnalysisPage;
