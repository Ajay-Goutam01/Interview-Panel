import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "achievement",
        "performance",
        "technical",
        "leadership",
        "experience",
        "education",
        "other",
      ],
      default: "other",
    },

    metric: {
      type: String,
      trim: true,
      default: null,
    },

    context: {
      type: String,
      trim: true,
      default: null,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },

    verificationRequired: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    fileId: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      enum: ["pdf", "doc", "docx"],
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["uploaded", "processing", "processed", "failed"],
      default: "uploaded",
    },

    extractedText: {
      type: String,
      default: null,
    },

    parsedData: {
      summary: {
        type: String,
        default: null,
        trim: true,
      },

      skills: [
        {
          type: String,
          trim: true,
        },
      ],

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

      experience: [
        {
          company: {
            type: String,
            trim: true,
          },

          position: {
            type: String,
            trim: true,
          },

          startDate: {
            type: Date,
          },

          endDate: {
            type: Date,
          },

          description: {
            type: String,
            trim: true,
          },

          technologies: [
            {
              type: String,
              trim: true,
            },
          ],
        },
      ],

      projects: [
        {
          name: {
            type: String,
            trim: true,
          },

          description: {
            type: String,
            trim: true,
          },

          technologies: [
            {
              type: String,
              trim: true,
            },
          ],

          url: {
            type: String,
            trim: true,
            default: null,
          },
        },
      ],

      achievements: [
        {
          type: String,
          trim: true,
        },
      ],

      certifications: [
        {
          name: {
            type: String,
            trim: true,
          },

          issuer: {
            type: String,
            trim: true,
          },

          issueDate: {
            type: Date,
          },
        },
      ],
    },

    claims: {
      type: [claimSchema],
      default: [],
    },

    aiAnalysis: {
      overallScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },

      strengths: [
        {
          type: String,
          trim: true,
        },
      ],

      weaknesses: [
        {
          type: String,
          trim: true,
        },
      ],

      missingSkills: [
        {
          type: String,
          trim: true,
        },
      ],

      recommendations: [
        {
          type: String,
          trim: true,
        },
      ],

      analyzedAt: {
        type: Date,
        default: null,
      },
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
