import { RequestHandler } from 'express';
import { withAsyncErrorHandling } from '../withAsyncErrorHandling';

export const handleGetHealthz: RequestHandler = withAsyncErrorHandling(
  async (_, res) => {
    res.status(200).json({
      buildNumber: process.env.BUILD_NUMBER || 'local',
      commitHash: process.env.COMMIT_HASH,
    });
    return;
  }
);
