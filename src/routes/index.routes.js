import { Router } from "express";
import { renderUser, createUser, renderEditUser, editUser, deleteUser, resetPassword } from "../controllers/users.controller";
import passport from "passport";
import { isAuthenticated, isAdmin } from "../helpers/auth";
const router = Router();

//Rutas de Login
router.get("/", async (req, res) => {
  res.render("index");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
  failureFlash: true,
})
);

//cerrar sesion
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/users", [isAuthenticated], renderUser);

router.post("/users/add", [isAuthenticated], createUser);

router.get("/users/:id/edit", [isAuthenticated], renderEditUser);

router.post("/users/:id/edit", [isAuthenticated], editUser);

router.get("/users/:id/delete", [isAuthenticated], deleteUser);

//Rutas de Restablecimiento de contraseña
router.post("/resetPassword", resetPassword);

export default router;