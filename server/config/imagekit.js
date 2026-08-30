import Imagekit from "@imagekit/nodejs";

const imagekit = new Imagekit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "dummy-private-key",
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "dummy-public-key",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/dummy",
});

export default imagekit;