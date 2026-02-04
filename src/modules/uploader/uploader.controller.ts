import { api } from 'encore.dev/api';
import applicationContext from 'src/applicationContext';
import busboy from 'busboy';

// Helper to get service
const getService = async () => {
  const { uploaderService } = await applicationContext;
  return uploaderService;
};

/**
 * Raw endpoint for file uploads.
 * Supports multiple files and fields.
 * Returns the path to the uploaded files in the 'tmp/' directory.
 */
export const uploadFile = api.raw(
  { expose: true, method: 'POST', path: '/upload', bodyLimit: null },
  async (req, res) => {
    const service = await getService();
    const bb = busboy({ headers: req.headers });
    const results: { filename: string; path: string; url: string }[] = [];
    const pendingFiles: Promise<void>[] = [];

    bb.on('file', (name, file, info) => {
      const { filename, mimeType } = info;
      const tmpPath = service.generateTmpPath(filename);

      // We collect data chunks in a buffer
      const chunks: Buffer[] = [];
      const filePromise = new Promise<void>((resolve, reject) => {
        file.on('data', (data) => {
          chunks.push(data);
        });

        file.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);
            await service.upload(tmpPath, buffer, mimeType);
            results.push({
              filename,
              path: tmpPath,
              url: service.getPublicUrl(tmpPath),
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        });

        file.on('error', (err) => {
          reject(err);
        });
      });

      pendingFiles.push(filePromise);
    });

    bb.on('finish', async () => {
      try {
        // Wait for all file uploads to complete
        await Promise.all(pendingFiles);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: true,
            data: results,
          }),
        );
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: false,
            error: (err as Error).message,
          }),
        );
      }
    });

    bb.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: false,
          error: (err as Error).message,
        }),
      );
    });

    req.pipe(bb);
  },
);

/* ------------------------------------------------------------------
 * LIST (ADMIN / DEBUG ONLY)
 * ------------------------------------------------------------------ */

interface UploadedFile {
  path: string;
  url: string;
  size: number;
  contentType: string;
}

export const listFiles = api(
  { expose: true, method: 'GET', path: '/upload' },
  async (query: {
    prefix?: 'tmp' | 'used';
  }): Promise<{ success: boolean; data: UploadedFile[] }> => {
    const service = await getService();

    // normalize & lock prefix
    const prefix = query.prefix === 'used' ? 'used/' : 'tmp/';

    const files = await service.listFiles(prefix);
    return { success: true, data: files };
  },
);
