const phoneRegex = /^[6-9]\d{9}$/;

const allowedFields = [
  "name",
  "phone",
  "bio",
  "education",
  "experienceLevel",
  "targetRoles",
  "skills",
  "preferredDifficulty",
];

export const updateProfileValidation = (req, res, next) => {
  const errors = [];
  const body = req.body;

  // Check for empty body
  if (!body || Object.keys(body).length === 0) {
    errors.push("At least one profile field is required");
  }

  // Check for unauthorized fields
  const invalidFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    errors.push(`You cannot update these fields: ${invalidFields.join(", ")}`);
  }

  // Name validation
  if (body.name !== undefined) {
    if (typeof body.name !== "string") {
      errors.push("Name must be a string");
    } else if (body.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    } else if (body.name.trim().length > 50) {
      errors.push("Name cannot exceed 50 characters");
    }
  }

  // Phone validation
  if (body.phone !== undefined) {
    if (typeof body.phone !== "string") {
      errors.push("Phone must be a string");
    } else if (!phoneRegex.test(body.phone.trim())) {
      errors.push("Please provide a valid Indian phone number");
    }
  }

  // Bio validation
  if (body.bio !== undefined) {
    if (typeof body.bio !== "string") {
      errors.push("Bio must be a string");
    } else if (body.bio.trim().length > 500) {
      errors.push("Bio cannot exceed 500 characters");
    }
  }

  // Education validation
  if (body.education !== undefined) {
    if (!Array.isArray(body.education)) {
      errors.push("Education must be an array");
    }
  }

  // Experience level validation
  const experienceLevels = ["fresher", "junior", "mid", "senior"];

  if (body.experienceLevel !== undefined) {
    if (!experienceLevels.includes(body.experienceLevel)) {
      errors.push("Invalid experience level");
    }
  }

  // Target roles validation
  if (body.targetRoles !== undefined) {
    if (!Array.isArray(body.targetRoles)) {
      errors.push("Target roles must be an array");
    } else if (!body.targetRoles.every((role) => typeof role === "string")) {
      errors.push("Every target role must be a string");
    }
  }

  // Skills validation
  if (body.skills !== undefined) {
    if (!Array.isArray(body.skills)) {
      errors.push("Skills must be an array");
    } else if (!body.skills.every((skill) => typeof skill === "string")) {
      errors.push("Every skill must be a string");
    }
  }

  // Preferred difficulty validation
  const difficulties = ["beginner", "easy", "medium", "hard", "expert"];

  if (body.preferredDifficulty !== undefined) {
    if (!difficulties.includes(body.preferredDifficulty)) {
      errors.push("Invalid preferred difficulty");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Profile validation failed",
      errors,
    });
  }

  next();
};
