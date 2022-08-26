import Users from "../models/users";
import Role from "../models/role";
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
  const role = await Role.find({ _id: user.role });
  if (role[0].role === "Administrador") {
    next();
  } else {
    res.redirect("/home");
    req.flash("error_msg", "No tienes permiso para acceder a esta opcion.");
  }
};

module.exports = helpers;
