const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

// Configure AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

async function uploadToS3(imagePath) {
  try {
    // Read the file from the local server
    const fileContent = fs.readFileSync(imagePath);
    const fileName = path.basename(imagePath); // Extract the file name from the path

    // Define S3 upload parameters (without ACL)
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
      Key: `uploads/${fileName}`, // File name in the S3 bucket
      Body: fileContent,
    };

    // Upload to S3
    const s3Response = await s3.upload(params).promise();

    console.log("File uploaded successfully. S3 URL:", s3Response.Location);
    return s3Response.Location; // Return the S3 URL
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}





// Export the function for use in other files
module.exports = { uploadToS3 };
