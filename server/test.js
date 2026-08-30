import "dotenv/config";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("=========================================");
console.log("🧪 RUNNING BACKEND INTEGRATION & UNIT TESTS");
console.log("=========================================");

let allPassed = true;

// 1. Syntax Check with node --check
console.log("\n1. Checking file syntax with node --check...");
const checkSyntaxRecursive = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".git") {
      checkSyntaxRecursive(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".js") && entry.name !== "test.js") {
      try {
        execSync(`node --check "${fullPath}"`, { stdio: "pipe" });
        console.log(`  ✓ Syntax OK: ${entry.name}`);
      } catch (err) {
        console.error(`  ✗ Syntax FAIL: ${fullPath}`, err.message);
        allPassed = false;
      }
    }
  }
};

checkSyntaxRecursive(__dirname);

// 2. ESM Import Test for all non-server modules
console.log("\n2. Testing ESM imports of all modules...");

const testImports = async () => {
  const filesToImport = [
    "app.js",
    "config/db.js",
    "config/imagekit.js",
    "config/openai.js",
    "utils/apiError.js",
    "utils/apiResponse.js",
    "utils/asyncHandler.js",
    "utils/jwt.js",
    "utils/aiParser.js",
    "middlewares/auth.middleware.js",
    "middlewares/error.middleware.js",
    "middlewares/upload.middleware.js",
    "middlewares/audioUpload.middleware.js",
    "models/user.model.js",
    "models/resume.model.js",
    "models/interview.model.js",
    "validations/auth.validation.js",
    "validations/user.validation.js",
    "services/auth.service.js",
    "services/user.service.js",
    "services/storage.service.js",
    "services/text-extraction.service.js",
    "services/resume-parser.service.js",
    "services/claims-extraction.service.js",
    "services/ai-analysis.service.js",
    "services/resume.service.js",
    "services/agent-prompt.service.js",
    "services/answer-evaluation.service.js",
    "services/answer-evalution.service.js",
    "services/final-evaluation.service.js",
    "services/interview-orchestrator.service.js",
    "services/interview-question.service.js",
    "services/interview.service.js",
    "services/voice.service.js",
    "services/voice-session.service.js",
    "controllers/auth.controller.js",
    "controllers/user.controller.js",
    "controllers/resume.controller.js",
    "controllers/interview.controller.js",
    "controllers/voice.controller.js",
    "controllers/voice-session.controller.js",
    "routes/auth.routes.js",
    "routes/user.routes.js",
    "routes/resume.routes.js",
    "routes/interview.routes.js",
    "routes/voice.routes.js",
    "sockets/voice.socket.js",
  ];

  for (const relPath of filesToImport) {
    try {
      const modulePath = path.join(__dirname, relPath);
      const moduleUrl = "file:///" + modulePath.replace(/\\/g, "/");
      await import(moduleUrl);
      console.log(`  ✓ Imported: ${relPath}`);
    } catch (err) {
      console.error(`  ✗ Import FAIL: ${relPath}: ${err.message}`);
      allPassed = false;
    }
  }
};

await testImports();

// 3. Unit Testing Core Logic
console.log("\n3. Testing Core Logic & Helpers...");

// Test ApiError
import ApiError from "./utils/apiError.js";
const testErr = new ApiError(404, "Not Found", ["item missing"]);
if (testErr.statusCode === 404 && testErr.message === "Not Found" && testErr.errors[0] === "item missing") {
  console.log("  ✓ ApiError structure test passed");
} else {
  console.error("  ✗ ApiError structure test failed", testErr);
  allPassed = false;
}

// Test ApiResponse
import ApiResponse from "./utils/apiResponse.js";
const testRes = new ApiResponse(201, "Created successfully", { id: 1 });
if (testRes.statusCode === 201 && testRes.message === "Created successfully" && testRes.data.id === 1 && testRes.success === true) {
  console.log("  ✓ ApiResponse structure test passed");
} else {
  console.error("  ✗ ApiResponse structure test failed", testRes);
  allPassed = false;
}

// Test parseAIJson & extractAIText
import { parseAIJson, extractAIText } from "./utils/aiParser.js";
const markdownJson = "```json\n{\"score\": 85, \"quality\": \"good\"}\n```";
const parsedJson = parseAIJson(markdownJson);
if (parsedJson.score === 85 && parsedJson.quality === "good") {
  console.log("  ✓ parseAIJson markdown stripping test passed");
} else {
  console.error("  ✗ parseAIJson test failed", parsedJson);
  allPassed = false;
}

const mockResponse = { output_text: "Hello interviewer" };
if (extractAIText(mockResponse) === "Hello interviewer") {
  console.log("  ✓ extractAIText test passed");
} else {
  console.error("  ✗ extractAIText test failed");
  allPassed = false;
}

// Test Interview Orchestrator
import { getAgentInitialQuestionCount, shouldSwitchAgent, getNextAgent } from "./services/interview-orchestrator.service.js";

const mockInterview = {
  agents: ["hr", "technical", "hiring_manager"],
  currentAgent: "hr",
  conversation: [
    { speaker: "ai", agent: "hr", questionType: "initial", text: "Tell me about yourself." },
    { speaker: "candidate", text: "I am a full stack dev." },
    { speaker: "ai", agent: "hr", questionType: "follow_up", text: "What stack?" },
    { speaker: "candidate", text: "MERN stack." },
    { speaker: "ai", agent: "hr", questionType: "initial", text: "What projects?" },
  ],
};

const initialCount = getAgentInitialQuestionCount(mockInterview, "hr");
if (initialCount === 2) {
  console.log("  ✓ getAgentInitialQuestionCount test passed (counted 2 initial, ignored follow-up)");
} else {
  console.error(`  ✗ getAgentInitialQuestionCount expected 2, got ${initialCount}`);
  allPassed = false;
}

if (!shouldSwitchAgent(mockInterview)) {
  console.log("  ✓ shouldSwitchAgent test passed (count 2 < limit 4)");
} else {
  console.error("  ✗ shouldSwitchAgent test failed");
  allPassed = false;
}

const nextAgent = getNextAgent(mockInterview);
if (nextAgent === "technical") {
  console.log("  ✓ getNextAgent test passed ('hr' -> 'technical')");
} else {
  console.error(`  ✗ getNextAgent expected 'technical', got ${nextAgent}`);
  allPassed = false;
}

console.log("\n=========================================");
if (allPassed) {
  console.log("🎉 ALL STATIC & UNIT TESTS PASSED SUCCESSFULLY!");
} else {
  console.error("❌ SOME TESTS FAILED!");
  process.exit(1);
}
console.log("=========================================\n");
