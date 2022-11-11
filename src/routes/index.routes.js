import { Router } from "express";
import passport from "passport";
import { isAuthenticated, isAdmin } from "../helpers/auth";
import { renderHome, renderUser, register } from "../controllers/users.controller";
import { createLot, renderChart, renderAnalysis, renderLot, renderEgg } from "../controllers/lots.controller";
const router = Router();

/*-- Rutas de Login --*/
router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/home", [isAuthenticated], renderHome);

router.get("/chart", [isAuthenticated], renderChart);

/*-- inciar sesión --*/
router.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
  failureFlash: true,
})
);

/*-- cerrar sesión --*/
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

/*-- registrar user --*/
router.post("/register", register);

//router.get("/users", [isAuthenticated], renderUser);
//router.post("/users/add", [isAuthenticated], createUser);
//router.get("/users/:id/edit", [isAuthenticated], renderEditUser);
//router.post("/users/:id/edit", [isAuthenticated], editUser);
//router.get("/users/:id/delete", [isAuthenticated], deleteUser);

/*-- Lotes --*/
router.get("/lots", [isAuthenticated], renderLot);
router.post("/lots/add", [isAuthenticated], createLot);

router.get("/lots/:id/view", [isAuthenticated], renderEgg);

//Rutas de Restablecimiento de contraseña
//router.post("/resetPassword", resetPassword);

/*-- Analisis --*/
router.get("/camera", async (req, res) => {
  res.render("camera");
});
router.get("/image", async (req, res) => {
  res.render("image");
});
router.post("/upload", async (req, res) => {
  res.redirect("/image");
});

export default router;