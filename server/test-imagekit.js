import "dotenv/config";
import fs from "fs";
import Imagekit from "@imagekit/nodejs";

const imagekit = new Imagekit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

console.log("Uploading test.txt...");

try {
  const result = await imagekit.files.upload({
    file: fs.createReadStream("./test.txt"),
    fileName: "test.txt",
    folder: "/test",
  });

  console.log("✅ IMAGEKIT UPLOAD WORKING");
  console.log(result);
} catch (error) {
  console.log("❌ IMAGEKIT UPLOAD FAILED");
  console.log("Message:", error.message);
  console.log("Status:", error.status);
  console.log("Error:", error.error);
}
