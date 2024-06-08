import { type Middleware } from 'next-api-route-middleware';

const { API_KEY } = process.env;

// eslint-disable-next-line func-names
export const authMiddleware: Middleware = async function (req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ error: 'Unauthorized' });
    if (authorization !== API_KEY)
      return res.status(403).json({ error: 'Forbidden' });

    return await next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Auth Middleware Error' });
  }
};

export const config = {
  maxDuration: 300,
};
