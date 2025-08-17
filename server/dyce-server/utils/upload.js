const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");
const crypto = require("crypto");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // not anon, use service role key on backend
);

const uploadToStorage = async (file, userId) => {
  console.log("Uploading file:", file);

  const fileExt = path.extname(file.originalname) || ".jpeg";
  const filename = `profile-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${fileExt}`;
  const filepath = `${userId}/${filename}`;

  // Compress the image using sharp
  const compressedImageBuffer = await sharp(file.buffer)
    .resize(800) // Resize width to 800px (preserving aspect ratio)
    .jpeg({ quality: 60 }) // Compress to 60% quality
    .toBuffer();

  // Upload to Supabase
  const { error } = await supabase.storage
    .from("profile-images")
    .upload(filepath, compressedImageBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error("Failed to upload image to storage");
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("profile-images")
    .getPublicUrl(filepath);

  return publicUrlData.publicUrl;
};

const deleteFromStorage = async (filepath) => {
  const { error } = await supabase.storage
    .from("profile-images")
    .remove([filepath]);

  if (error) {
    console.error("Failed to delete image from Supabase:", error);
  }
};
const extractSupabasePathFromUrl = (url) => {
  const match = url.match(/\/profile-images\/(.+)$/);
  return match ? match[1] : null;
};

module.exports = { uploadToStorage, deleteFromStorage, extractSupabasePathFromUrl };
