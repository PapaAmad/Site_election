const jwt = require("jsonwebtoken");
const { db } = require("../database/init");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token d'accès requis" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }

    req.user = user;
    next();
  });
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentification requise" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Permissions insuffisantes" });
    }

    next();
  };
};

const requireStatus = (statuses) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentification requise" });
    }

    if (!statuses.includes(req.user.status)) {
      return res.status(403).json({ error: "Compte non autorisé" });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireStatus,
};
