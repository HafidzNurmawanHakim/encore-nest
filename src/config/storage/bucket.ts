import { Bucket } from 'encore.dev/storage/objects';

/**
 * Bucket for storing file uploads.
 * In development, this uses the local filesystem.
 * In cloud, this uses S3/GCS.
 */
export const uploadsBucket = new Bucket('uploads', {
  public: true,
});
