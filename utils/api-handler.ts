import type { NextApiHandler } from 'next';
import { getZodError } from './get-zod-error';

export function apiHandler(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    if (req.method?.toLowerCase() !== 'post') {
      return res.status(405).end();
    }

    try {
      await handler(req, res);
    } catch (error: unknown) {
      const err = error as { errors?: unknown[]; http_code?: number; message?: string };
      const message = Array.isArray(err.errors)
        ? getZodError(err.errors[0])
        : typeof err.http_code === 'number'
        ? 'Error loading resource'
        : err.message ?? 'Something went wrong';

      res.status(400).json({ message });
    }
  };
}
