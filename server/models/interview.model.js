import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    speaker: {
      type: String,
      enum: ["ai", "candidate"],
      required: true,
    },
    questionType: {
      type: String,
      enum: ["initial", "follow_up", null],
      default: null,
    },

    agent: {
      type: String,
      enum: ["hr", "technical", "hiring_manager", null],
      default: null,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      enum: ["english", "hindi", "hinglish"],
      default: "hinglish",
    },

    evaluation: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      quality: {
        type: String,
        enum: ["weak", "average", "good", "excellent", null],
        default: null,
      },
      strengths: {
        type: [String],
        default: [],
      },
      weaknesses: {
        type: [String],
        default: [],
      },
      missingPoints: {
        type: [String],
        default: [],
      },
      feedback: {
        type: String,
        default: null,
      },
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    interviewType: {
      type: String,
      enum: ["full", "hr", "technical", "behavioral"],
      default: "full",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "expert"],
      default: "medium",
    },

    language: {
      type: String,
      enum: ["english", "hindi", "hinglish"],
      default: "hinglish",
    },

    agents: [
      {
        type: String,
        enum: ["hr", "technical", "hiring_manager"],
      },
    ],

    currentAgent: {
      type: String,
      enum: ["hr", "technical", "hiring_manager", null],
      default: null,
    },

    currentQuestion: {
      type: String,
      default: null,
    },

    conversation: {
      type: [messageSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["created", "active", "completed", "cancelled"],
      default: "created",
    },

    score: {
      overall: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },

      technical: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },

      communication: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },

      problemSolving: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },

      confidence: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      recommendations: {
        type: [String],
        default: [],
      },

      hiringRecommendation: {
        type: String,
        enum: ["strong_hire", "hire", "consider", "no_hire"],
        default: null,
      },
    },
    evaluation: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },

      quality: {
        type: String,
        enum: ["weak", "average", "good", "excellent"],
        default: null,
      },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      missingPoints: {
        type: [String],
        default: [],
      },

      feedback: {
        type: String,
        default: null,
      },
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
