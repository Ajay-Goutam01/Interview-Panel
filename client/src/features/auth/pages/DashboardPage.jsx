import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Navbar from "../../../components/layout/Navbar";

import useProfile from "../../profile/hooks/useProfile";
import useResume from "../../resume/hooks/useResume";
import useInterviews from "../../interview/hooks/useInterviews";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { profile, loading: profileLoading } = useProfile();

  const { resumes = [], loading: resumeLoading } = useResume();

  const { interviews = [], loading: interviewLoading } = useInterviews();

  const firstName = user?.name?.split(" ")[0] || "there";

  const profileCompletion = Math.min(
    100,
    Math.max(0, profile?.profileCompletion ?? 0),
  );

  const resumeCount = Array.isArray(resumes) ? resumes.length : 0;

  const interviewCount = Array.isArray(interviews) ? interviews.length : 0;

  const recentInterviews = Array.isArray(interviews)
    ? interviews.slice(0, 5)
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600">Dashboard</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Welcome back, {firstName} 👋
            </h1>

            <p className="mt-2 text-gray-500">
              Ready to prepare for your next interview?
            </p>
          </div>

          <Button onClick={() => navigate("/interview/create")}>
            Start Interview
          </Button>
        </header>

        {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Profile Completion */}
          <Card className="p-5">
            <p className="text-sm font-medium text-gray-500">
              Profile completion
            </p>

            <div className="mt-3 flex items-end justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {profileLoading ? "..." : `${profileCompletion}%`}
              </span>

              <span className="text-sm text-gray-400">
                {profileLoading
                  ? "Loading..."
                  : profileCompletion >= 100
                    ? "Complete"
                    : "Get started"}
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-purple-600 transition-all duration-500"
                style={{
                  width: `${profileCompletion}%`,
                }}
              />
            </div>
          </Card>

          {/* Resumes */}
          <Card className="p-5">
            <p className="text-sm font-medium text-gray-500">Resumes</p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {resumeLoading ? "..." : resumeCount}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              {resumeLoading
                ? "Loading resumes..."
                : resumeCount > 0
                  ? `${resumeCount} resume${
                      resumeCount > 1 ? "s" : ""
                    } uploaded`
                  : "No resume uploaded yet"}
            </p>
          </Card>

          {/* Interviews */}
          <Card className="p-5">
            <p className="text-sm font-medium text-gray-500">Interviews</p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {interviewLoading ? "..." : interviewCount}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              {interviewLoading
                ? "Loading interviews..."
                : interviewCount > 0
                  ? `${interviewCount} interview${
                      interviewCount > 1 ? "s" : ""
                    } recorded`
                  : "No interviews yet"}
            </p>
          </Card>
        </section>

        {/* Main Actions */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Resume Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Resume</h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Upload your resume to personalize your interview experience.
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                {resumeLoading
                  ? "Loading..."
                  : resumeCount > 0
                    ? "Uploaded"
                    : "Not uploaded"}
              </span>
            </div>

            <Button className="mt-6" onClick={() => navigate("/resume")}>
              Upload Resume
            </Button>
          </Card>

          {/* Interview Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Practice interview
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Start an AI-powered interview based on your target role and
              preferred difficulty.
            </p>

            <Button
              className="mt-6"
              onClick={() => navigate("/interview/create")}
            >
              Start Practice
            </Button>
          </Card>
        </section>

        {/* Recent Interviews */}
        <section className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent interviews
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your latest interview activity will appear here.
                </p>
              </div>
            </div>

            {/* Loading */}
            {interviewLoading && (
              <div className="mt-8 flex min-h-32 items-center justify-center rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-400">Loading interviews...</p>
              </div>
            )}

            {/* Empty */}
            {!interviewLoading && interviewCount === 0 && (
              <div className="mt-8 flex min-h-32 items-center justify-center rounded-xl border border-dashed border-gray-200">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">
                    No interviews yet
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Start your first practice interview to see it here.
                  </p>
                </div>
              </div>
            )}

            {/* Interviews */}
            {!interviewLoading && recentInterviews.length > 0 && (
              <div className="mt-6 space-y-3">
                {recentInterviews.map((interview) => (
                  <div
                    key={interview._id || interview.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {interview.title ||
                          `${interview.interviewType || "Interview"} Interview`}
                      </p>

                      <p className="mt-1 text-sm capitalize text-gray-400">
                        {interview.status || "Unknown status"}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-purple-600">
                      {interview.score?.overall != null
                        ? `${interview.score.overall}%`
                        : "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
