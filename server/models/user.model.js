import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      sparse: true,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid phone number"],
    },

    profile: {
      bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot exceed 500 characters"],
      },

      education: [
        {
          degree: {
            type: String,
            trim: true,
          },

          institution: {
            type: String,
            trim: true,
          },

          field: {
            type: String,
            trim: true,
          },

          startYear: {
            type: Number,
          },

          endYear: {
            type: Number,
          },

          grade: {
            type: String,
            trim: true,
          },
        },
      ],

      experienceLevel: {
        type: String,
        enum: ["fresher", "junior", "mid", "senior"],
        default: "fresher",
      },

      targetRoles: [
        {
          type: String,
          trim: true,
        },
      ],

      skills: [
        {
          type: String,
          trim: true,
        },
      ],

      preferredDifficulty: {
        type: String,
        enum: ["beginner", "easy", "medium", "hard", "expert"],
        default: "medium",
      },
    },

    role: {
      type: String,
      enum: ["candidate", "admin"],
      default: "candidate",
    },

    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

//

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
