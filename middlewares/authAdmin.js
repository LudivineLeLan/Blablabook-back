export function authAdmin(req, res, next) {
  try {
    const user = req.user; // récupéré depuis ton middleware d’auth standard
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Accès interdit : administrateur requis." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentification invalide." });
  }
}
