import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Expected format: Bearer <token>
    const extractedToken = token.split(' ')[1];
    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
