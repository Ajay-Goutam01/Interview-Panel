import { useEffect, useState } from "react";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Navbar from "../../../components/layout/Navbar";

import useProfile from "../hooks/useProfile";
import profileService from "../services/profile.service";

const initialForm = {
  name: "",
  phone: "",
  bio: "",

  degree: "",
  institution: "",
  field: "",
  startYear: "",
  endYear: "",
  grade: "",

  experienceLevel: "",
  targetRoles: "",
  skills: "",
  preferredDifficulty: "",
};

const ProfilePage = () => {
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    fetchProfile,
  } = useProfile();

  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!profile) return;

    const education =
      Array.isArray(profile.education) && profile.education.length > 0
        ? profile.education[0]
        : {};

    setForm({
      name: profile.name || "",
      phone: profile.phone || "",
      bio: profile.bio || "",

      degree: education.degree || "",
      institution: education.institution || "",
      field: education.field || "",
      startYear: education.startYear || "",
      endYear: education.endYear || "",
      grade: education.grade || "",

      experienceLevel: profile.experienceLevel || "",

      targetRoles: Array.isArray(profile.targetRoles)
        ? profile.targetRoles.join(", ")
        : "",

      skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",

      preferredDifficulty: profile.preferredDifficulty || "",
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaveError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setSaveError("");
    setSuccessMessage("");

    try {
      const education = {
        degree: form.degree.trim(),
        institution: form.institution.trim(),
        field: form.field.trim(),
        grade: form.grade.trim(),
      };

      if (form.startYear) {
        education.startYear = Number(form.startYear);
      }

      if (form.endYear) {
        education.endYear = Number(form.endYear);
      }

      const hasEducation =
        education.degree ||
        education.institution ||
        education.field ||
        education.startYear ||
        education.endYear ||
        education.grade;

      const payload = {
        name: form.name.trim(),

        phone: form.phone.trim(),

        bio: form.bio.trim(),

        education: hasEducation ? [education] : [],

        experienceLevel: form.experienceLevel,

        targetRoles: form.targetRoles
          .split(",")
          .map((role) => role.trim())
          .filter(Boolean),

        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        preferredDifficulty: form.preferredDifficulty,
      };

      await profileService.updateProfile(payload);

      await fetchProfile();

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      const errors = error.response?.data?.errors;

      if (Array.isArray(errors) && errors.length > 0) {
        setSaveError(errors.join(" "));
      } else {
        setSaveError(
          error.response?.data?.message || "Unable to update your profile.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const profileCompletion = Math.min(
    100,
    Math.max(0, profile?.profileCompletion ?? 0),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
          {/* Header */}
          <div>
            <p className="text-sm font-medium text-purple-600">Profile</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Your profile
            </h1>

            <p className="mt-2 text-gray-500">
              Keep your information updated to personalize your interview
              experience.
            </p>
          </div>

          {/* Loading */}
          {profileLoading && (
            <Card className="mt-6 p-6">
              <p className="text-sm text-gray-500">Loading your profile...</p>
            </Card>
          )}

          {/* Error */}
          {!profileLoading && profileError && (
            <Card className="mt-6 border-red-200 p-6">
              <p className="text-sm text-red-600">{profileError}</p>
            </Card>
          )}

          {!profileLoading && profile && (
            <>
              {/* Profile Completion */}
              <Card className="mt-6 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Profile completion
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Complete your profile to improve personalization.
                    </p>
                  </div>

                  <span className="text-2xl font-bold text-purple-600">
                    {profileCompletion}%
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

              {/* Form */}
              <Card className="mt-6 p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <section>
                    <div className="mb-5">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Basic information
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Tell us about yourself.
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Full name
                        </label>

                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>

                        <input
                          id="email"
                          type="email"
                          value={profile.email || ""}
                          disabled
                          className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-5">
                      <label
                        htmlFor="bio"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Bio
                      </label>

                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={form.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                  </section>

                  {/* Education */}
                  <section className="border-t border-gray-100 pt-8">
                    <div className="mb-5">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Education
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Add your latest education details.
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Degree */}
                      <div>
                        <label
                          htmlFor="degree"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Degree
                        </label>

                        <input
                          id="degree"
                          name="degree"
                          type="text"
                          value={form.degree}
                          onChange={handleChange}
                          placeholder="B.Tech"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                      </div>

                      {/* Institution */}
                      <div>
                        <label
                          htmlFor="institution"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Institution
                        </label>

                        <input
                          id="institution"
                          name="institution"
                          type="text"
                          value={form.institution}
                          onChange={handleChange}
                          placeholder="Your college/university"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                      </div>

                      {/* Field */}
                      <div>
                        <label
                          htmlFor="field"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Field of study
                        </label>

                        <input
                          id="field"
                          name="field"
                          type="text"
                          value={form.field}
                          onChange={handleChange}
                          placeholder="Computer Science"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                      </div>

                      {/* Grade */}
                      <div>
                        <label
                          htmlFor="grade"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Grade / CGPA
                        </label>

                        <input
                          id="grade"
                          name="grade"
                          type="text"
                          value={form.grade}
                          onChange={handleChange}
                          placeholder="7.5 CGPA"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                      </div>

                      {/* Start Year */}
                      <div>
                        <label
                          htmlFor="startYear"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Start year
                        </label>

                        <input
                          id="startYear"
                          name="startYear"
                          type="number"
                          value={form.startYear}
                          onChange={handleChange}
                          placeholder="2023"
                          min="1900"
                          max="2100"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                      </div>

                      {/* End Year */}
                      <div>
                        <label
                          htmlFor="endYear"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          End year
                        </label>

                        <input
                          id="endYear"
                          name="endYear"
                          type="number"
                          value={form.endYear}
                          onChange={handleChange}
                          placeholder="2027"
                          min="1900"
                          max="2100"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Career Preferences */}
                  <section className="border-t border-gray-100 pt-8">
                    <div className="mb-5">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Career preferences
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Help the AI customize your interviews.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Experience */}
                      <div>
                        <label
                          htmlFor="experienceLevel"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Experience level
                        </label>

                        <select
                          id="experienceLevel"
                          name="experienceLevel"
                          value={form.experienceLevel}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        >
                          <option value="">Select experience level</option>

                          <option value="fresher">Fresher</option>

                          <option value="junior">Junior</option>

                          <option value="mid">Mid Level</option>

                          <option value="senior">Senior</option>
                        </select>
                      </div>

                      {/* Difficulty */}
                      <div>
                        <label
                          htmlFor="preferredDifficulty"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Preferred difficulty
                        </label>

                        <select
                          id="preferredDifficulty"
                          name="preferredDifficulty"
                          value={form.preferredDifficulty}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        >
                          <option value="">Select difficulty</option>

                          <option value="beginner">Beginner</option>

                          <option value="easy">Easy</option>

                          <option value="medium">Medium</option>

                          <option value="hard">Hard</option>

                          <option value="expert">Expert</option>
                        </select>
                      </div>

                      {/* Target Roles */}
                      <div>
                        <label
                          htmlFor="targetRoles"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Target roles
                        </label>

                        <input
                          id="targetRoles"
                          name="targetRoles"
                          type="text"
                          value={form.targetRoles}
                          onChange={handleChange}
                          placeholder="Frontend Developer, MERN Developer"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />

                        <p className="mt-1 text-xs text-gray-400">
                          Separate multiple roles with commas.
                        </p>
                      </div>

                      {/* Skills */}
                      <div>
                        <label
                          htmlFor="skills"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Skills
                        </label>

                        <input
                          id="skills"
                          name="skills"
                          type="text"
                          value={form.skills}
                          onChange={handleChange}
                          placeholder="React, Node.js, MongoDB, DSA"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />

                        <p className="mt-1 text-xs text-gray-400">
                          Separate multiple skills with commas.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Messages */}
                  {saveError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm text-red-600">{saveError}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                      <p className="text-sm text-green-600">{successMessage}</p>
                    </div>
                  )}

                  {/* Save */}
                  <div className="flex justify-end border-t border-gray-100 pt-6">
                    <Button type="submit" loading={saving}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
