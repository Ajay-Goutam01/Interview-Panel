import Imagekit from "@imagekit/nodejs";

const imagekit = new Imagekit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  timeout: 15000,
  maxRetries: 0,
});

export default imagekit;
