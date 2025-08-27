import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import passport from 'passport';

import { Chat } from './ChatModel';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp_randomString.extension
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

// File filter to only allow images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export const ChatRouter: Router = (() => {
  const router = express.Router();

  router.get(
    '/:channelId',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const chats = await Chat.find({ channel: request.params.channelId }).populate('sender').populate('channel');

      if (chats) {
        return response.api.success(chats);
      } else {
        response.api.error({}, 500, 'Something went wrong');
      }
    }
  );

  router.post(
    '/upload',
    passport.authenticate('jwt', { session: false }),
    upload.single('image'), // 'image' should match the FormData key from frontend
    async (request: Request, response: Response) => {
      try {
        // Check if file was uploaded
        if (!request.file) {
          return response.api.error({}, 400, 'No file uploaded');
        }

        // Get file information
        const file = request.file;
        const fileUrl = `/uploads/${file.filename}`;

        // Optional: Save file info to database
        // You can create a File model and save file details
        /*
      const fileRecord = new File({
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        url: fileUrl,
        uploadedBy: request.user.id, // assuming user is attached to request
        uploadedAt: new Date()
      });
      
      await fileRecord.save();
      */
        const baseUrl = request.protocol + '://' + request.get('host');
        // Return success response with file information
        return response.api.success(
          {
            originalName: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            url: baseUrl + fileUrl,
            uploadedAt: new Date(),
          },
          200,
          'File uploaded successfully'
        );
      } catch (error) {
        console.error('File upload error:', error);

        // Clean up file if it was uploaded but processing failed
        if (request.file && fs.existsSync(request.file.path)) {
          fs.unlinkSync(request.file.path);
        }

        return response.api.error({}, 500, 'File upload failed');
      }
    }
  );

  // Error handling middleware for multer
  const handleMulterError = (error: any, req: Request, res: Response, next: any) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.api.error({}, 400, 'File size too large. Maximum size is 10MB.');
      }
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.api.error({}, 400, 'Unexpected file field.');
      }
    }

    if (error.message === 'Only image files are allowed!') {
      return res.api.error({}, 400, 'Only image files are allowed.');
    }

    return res.api.error({}, 500, 'File upload error.');
  };

  // Apply error handling middleware
  router.use(handleMulterError);

  return router;
})();
