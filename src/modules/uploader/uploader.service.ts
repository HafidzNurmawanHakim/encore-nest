import { Injectable } from '@nestjs/common';
import { uploadsBucket } from 'src/config/storage/bucket';
import { randomUUID } from 'crypto';

@Injectable()
export class UploaderService {
  /* ------------------------------------------------------------------
   * PATH & NAMING
   * ------------------------------------------------------------------ */

  /**
   * Generates a temporary upload path.
   * Format: tmp/{timestamp}-{uuid}.{ext}
   */
  generateTmpPath(filename: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const uuid = randomUUID().split('-')[0];
    const ext = filename.split('.').pop() || 'file';

    return `tmp/${timestamp}-${uuid}.${ext}`;
  }

  /**
   * Ensure only tmp paths are used for temporary uploads
   */
  private assertTmpPath(path: string) {
    if (!path.startsWith('tmp/')) {
      throw new Error(`Invalid tmp path: ${path}`);
    }
  }

  /**
   * Ensure only used paths are used for permanent files
   */
  private assertUsedPath(path: string) {
    if (!path.startsWith('used/')) {
      throw new Error(`Invalid used path: ${path}`);
    }
  }

  /* ------------------------------------------------------------------
   * UPLOAD (STREAMING)
   * ------------------------------------------------------------------ */

  /**
   * Uploads file data to a specific path in the bucket.
   */
  async upload(
    path: string,
    data: Buffer,
    contentType: string,
  ): Promise<string> {
    await uploadsBucket.upload(path, data, {
      contentType,
    });
    return path;
  }
  /* ------------------------------------------------------------------
   * PROMOTION (TMP → USED)
   * ------------------------------------------------------------------ */

  /**
   * Promote a temporary file to a permanent location.
   * This is a copy + delete, as Encore does not support atomic move.
   */
  async promote(tmpPath: string, targetPath: string): Promise<string> {
    this.assertTmpPath(tmpPath);
    this.assertUsedPath(targetPath);

    // Read attributes first (content-type, size, etc)
    const attrs = await uploadsBucket.attrs(tmpPath);

    // Download returns a Readable stream
    const reader = uploadsBucket.download(tmpPath);

    // Upload stream to target
    const writer = uploadsBucket.upload(targetPath, {
      contentType: attrs.contentType,
    });

    // Pipe stream → stream
    await new Promise<void>((resolve, reject) => {
      reader
        .on('error', reject)
        .pipe(writer)
        .on('error', reject)
        .on('close', resolve);
    });

    // Remove tmp file only after successful upload
    await uploadsBucket.remove(tmpPath);

    return targetPath;
  }

  /* ------------------------------------------------------------------
   * LISTING (PREFIX-BASED)
   * ------------------------------------------------------------------ */

  /**
   * List files by prefix (tmp/ or used/)
   * NOTE: Intended for admin / debug / cron use only.
   */
  async listFiles(prefix: 'tmp/' | 'used/') {
    const files: {
      path: string;
      url: string;
      size: number;
      contentType: string;
    }[] = [];

    for await (const entry of uploadsBucket.list({ prefix })) {
      const attrs = await uploadsBucket.attrs(entry.name);

      files.push({
        path: entry.name,
        url: uploadsBucket.publicUrl(entry.name),
        size: attrs.size,
        contentType: attrs.contentType ?? 'application/octet-stream',
      });
    }

    return files;
  }

  /* ------------------------------------------------------------------
   * READ
   * ------------------------------------------------------------------ */

  /**
   * Download file as a stream + attributes.
   * Caller is responsible for piping the stream.
   */
  async getFileStream(path: string) {
    const attrs = await uploadsBucket.attrs(path);
    const stream = uploadsBucket.download(path);

    return {
      stream,
      attrs,
    };
  }

  /* ------------------------------------------------------------------
   * DELETE
   * ------------------------------------------------------------------ */

  /**
   * Delete a temporary file safely.
   */
  async deleteTmp(path: string): Promise<void> {
    this.assertTmpPath(path);
    await uploadsBucket.remove(path);
  }

  /**
   * Returns the public URL for a given path.
   * Encore automatically handles this when the bucket is public.
   */
  getPublicUrl(path: string): string {
    // We'll return the path prefixed with /storage for our new GET route
    return `/storage/${path}`;
  }
}
