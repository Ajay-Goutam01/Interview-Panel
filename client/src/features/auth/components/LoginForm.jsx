import { useId, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForm = ({ email, password }) => {
  const errors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Please provide a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const emailId = useId();
  const passwordId = useId();

  const { login, loading, error, clearAuthError } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;

      setFormData((current) => ({ ...current, [name]: value }));

      setFormErrors((current) =>
        current[name] ? { ...current, [name]: "" } : current,
      );

      clearAuthError?.();
    },
    [clearAuthError],
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((current) => !current);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const errors = validateForm(formData);
      setFormErrors(errors);

      if (Object.keys(errors).length > 0) {
        return;
      }

      try {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });

        navigate("/dashboard", { replace: true });
      } catch {
        // API error is already handled by useAuth.
      }
    },
    [formData, login, navigate],
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign in to continue your interview preparation.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor={emailId} className="mb-2 block text-sm font-medium">
          Email
        </label>

        <input
          id={emailId}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          disabled={loading}
          aria-invalid={Boolean(formErrors.email)}
          aria-describedby={formErrors.email ? `${emailId}-error` : undefined}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="you@example.com"
        />

        {formErrors.email && (
          <p id={`${emailId}-error`} className="mt-1 text-sm text-red-600">
            {formErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={passwordId} className="mb-2 block text-sm font-medium">
          Password
        </label>

        <div className="relative">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            disabled={loading}
            aria-invalid={Boolean(formErrors.password)}
            aria-describedby={
              formErrors.password ? `${passwordId}-error` : undefined
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Enter your password"
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-purple-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {formErrors.password && (
          <p id={`${passwordId}-error`} className="mt-1 text-sm text-red-600">
            {formErrors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-purple-600 hover:text-purple-700"
        >
          Create account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
