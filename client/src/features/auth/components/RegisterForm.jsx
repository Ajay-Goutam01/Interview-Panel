import { useId, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const RE = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
};

const FIELDS = [
  {
    name: "name",
    label: "Full name",
    type: "text",
    autoComplete: "name",
    placeholder: "John Doe",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
  },
  {
    name: "phone",
    label: "Phone",
    optional: true,
    type: "tel",
    autoComplete: "tel",
    placeholder: "9876543210",
    inputMode: "numeric",
    maxLength: 10,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "At least 8 characters",
    toggle: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "Re-enter your password",
    toggle: true,
  },
];

const validate = (formData) => {
  const errors = {};

  const name = formData.name.trim();
  const email = formData.email.trim();
  const phone = formData.phone.trim();
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;

  // Name
  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (name.length > 50) {
    errors.name = "Name cannot exceed 50 characters";
  }

  // Email
  if (!email) {
    errors.email = "Email is required";
  } else if (!RE.email.test(email)) {
    errors.email = "Please provide a valid email address";
  }

  // Password
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  // Confirm password
  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // Phone
  if (phone && !RE.phone.test(phone)) {
    errors.phone = "Please provide a valid 10-digit phone number";
  }

  return errors;
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const uid = useId();

  const { register, loading, error, clearAuthError } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPass, setShowPass] = useState({});

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;

      setFormData((current) => ({
        ...current,
        [name]: value,
      }));

      setFormErrors((current) => {
        if (!current[name]) {
          return current;
        }

        const updatedErrors = { ...current };
        delete updatedErrors[name];

        return updatedErrors;
      });

      clearAuthError?.();
    },
    [clearAuthError],
  );

  const toggleShow = useCallback((name) => {
    setShowPass((current) => ({
      ...current,
      [name]: !current[name],
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const errors = validate(formData);

      setFormErrors(errors);

      if (Object.keys(errors).length > 0) {
        return;
      }

      try {
        await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim(),
        });

        navigate("/dashboard", { replace: true });
      } catch {
        // Authentication error is handled by useAuth.
      }
    },
    [formData, register, navigate],
  );

  const inputCls =
    "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5"
      noValidate
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Start preparing for your next interview.
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

      {FIELDS.map((field) => {
        const id = `${uid}-${field.name}`;
        const fieldError = formErrors[field.name];

        const inputType = field.toggle
          ? showPass[field.name]
            ? "text"
            : "password"
          : field.type;

        return (
          <div key={field.name}>
            <label htmlFor={id} className="mb-2 block text-sm font-medium">
              {field.label}

              {field.optional && (
                <span className="font-normal text-gray-400"> (optional)</span>
              )}
            </label>

            <div className="relative">
              <input
                id={id}
                name={field.name}
                type={inputType}
                value={formData[field.name]}
                onChange={handleChange}
                autoComplete={field.autoComplete}
                disabled={loading}
                inputMode={field.inputMode}
                maxLength={field.maxLength}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? `${id}-error` : undefined}
                className={`${inputCls} ${field.toggle ? "pr-20" : ""}`}
                placeholder={field.placeholder}
              />

              {field.toggle && (
                <button
                  type="button"
                  onClick={() => toggleShow(field.name)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-purple-600"
                >
                  {showPass[field.name] ? "Hide" : "Show"}
                </button>
              )}
            </div>

            {fieldError && (
              <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
                {fieldError}
              </p>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-purple-600 hover:text-purple-700"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
