import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied" });

  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};
