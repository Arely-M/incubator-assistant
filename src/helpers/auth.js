import Users from "../models/users";
const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Usuario no autorizado");
  res.redirect("/");
};

helpers.isAdmin = async (req, res, next) => {
  const user = await Users.findById(req.user.id);
  const rol = await Rols.find({ _id: user.rol });
  if (rol[0].rol === "Administrador") {
    next();
  } else {
    res.redirect("/intents");
    req.flash("error_msg", "No tienes permiso para acceder a esta opcion");
  }
};

module.exports = helpers;
