const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;

export const registerValidation = (req, res, next) => {
  const { name, email, password, phone } = req.body;

  const errors = [];

  // Name validation
  if (!name) {
    errors.push("Name is required");
  } else if (typeof name !== "string") {
    errors.push("Name must be in words");
  } else if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (name.trim().length > 50) {
    errors.push("Name cannot exceed 50 characters");
  }

  // Email validation
  if (!email) {
    errors.push("Email is required");
  } else if (typeof email !== "string") {
    errors.push("Email must be a string");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  // Password validation
  if (!password) {
    errors.push("Password is required");
  } else if (typeof password !== "string") {
    errors.push("Password must be a string");
  } else if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  // Phone validation
  if (phone && !phoneRegex.test(phone.trim())) {
    errors.push("Please provide a valid Indian phone number");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const loginValidation = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  // Email validation
  if (!email) {
    errors.push("Email is required");
  } else if (typeof email !== "string") {
    errors.push("Email must be a string");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  // Password validation
  if (!password) {
    errors.push("Password is required");
  } else if (typeof password !== "string") {
    errors.push("Password must be a string");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};
