import * as AWS from 'aws-sdk';
import { read } from 'node:fs';

const fs = require('fs').promises;
const s3_baseImage_path = 'images/uploadimage/';
const s3_maskImage_path = 'images/maskimage/';
const s3_avatarImage_path = 'images/avatarimage/';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const s3Service = async (file) => {
  const readData = await fs.readFile(`${file.destination}/${file.filename}`);

  return await s3_upload(
    readData,
    process.env.AWS_S3_BUCKET_NAME,
    file.filename,
    s3_baseImage_path,
    'image/png',
  );
};

export const s3Service_converted = async (path: string, file: any) => {
  const readData = await fs.readFile(`${path}`);
  console.log('fileinfo===================>>>>', file);
  console.log('readdata===================>>>>', readData);
  console.log(
    'aws_bucket',
    process.env.AWS_S3_BUCKET_NAME,
    process.env.AWS_S3_BUCKET_REGION,
  );
  return await s3_upload(
    readData,
    process.env.AWS_S3_BUCKET_NAME,
    file.filename,
    s3_baseImage_path,
    'image/png',
  );
};

export const s3Service_download = async (path: string, filename: string) => {
  const readData = await fs.readFile(`${path}`);

  return await s3_upload(
    readData,
    process.env.AWS_S3_BUCKET_NAME,
    filename,
    s3_baseImage_path,
    'image/png',
  );
};

export const s3Service_mask = async (file) => {
  const readData = await fs.readFile(`${file.destination}/${file.filename}`);

  return await s3_upload(
    readData,
    process.env.AWS_S3_BUCKET_NAME,
    file.filename,
    s3_maskImage_path,
    'image/png',
  );
};

export const s3Service_mask_converted = async (path: string, file: any) => {
  const readData = await fs.readFile(`${path}`);

  console.log('s3Service_mask_converted', path, 'file', file);
  return await s3_upload(
    readData,
    process.env.AWS_S3_BUCKET_NAME,
    file.filename,
    s3_maskImage_path,
    'image/png',
  );
};

export const s3Service_nonemask_converted = async (
  path: string,
  fileName: string,
) => {
  console.log('s3Service_mask_converted', path, 'file', fileName);
  const readData = await fs.readFile(`${path}`);

  return await s3_upload(
    readData,
    process.env.AWS_S3_BUCKET_NAME,
    fileName,
    s3_maskImage_path,
    'image/png',
  );
};

// const s3_upload = async (
//   file: any,
//   bucket: string,
//   name: string,
//   path: string,
//   mimetype: string,
// ) => {
//   // if (!file) return;
//   const fileKey = String(`${path}${name}.png`);
//   const uploadEndpoint = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.process.env.AWS_S3_BUCKET_NAME_REGION}.amazonaws.com/`;
//   const formData = new FormData();
//   formData.append('key', fileKey);
//   formData.append('Content-Type', mimetype); // Setting the Content-Type
//   formData.append('file', file);

//   try {
//     const response = await fetch(uploadEndpoint, {
//       method: 'POST',
//       body: formData,
//     });

//     if (response.ok) {
//       console.log('------------------------------>>>Successfully uploaded file.', response);
//       const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.process.env.AWS_S3_BUCKET_NAME_REGION}.amazonaws.com/${fileKey}`;
//       console.log(imageUrl);
//       return response;
//     } else {
//       console.log('Upload failed.');
//     }
//   } catch (error) {
//     console.error('Error uploading file:', error);
//   }
// };

// Update s3_upload to s3_upload_origin
const s3_upload = async (
  file: any,
  bucket: string,
  name: string,
  path: string,
  mimetype: string,
) => {
  const params = {
    Bucket: bucket,
    Key: String(`${path}${name}.png`),
    Body: file,
    ACL: 'public-read',
    ContentType: mimetype,
    ContentDisposition: 'inline',
    CreateBucketConfiguration: {
      LocationConstraint: process.env.AWS_S3_BUCKET_NAME_REGION,
    },
  };

  try {
    const s3Response = await s3.upload(params).promise();

    return s3Response;
  } catch (e) {
    console.log(e);
  }
};

export const s3Service_avatar = async (path: string, file: any) => {
  const readData = await fs.readFile(`${path}`);

  console.log('s3Service_avatar', path, 'file', file);
  return await s3_upload(
    readData,
    process.env.AWS_S3_BUCKET_NAME,
    file.filename,
    s3_avatarImage_path,
    'image/png',
  );
};
