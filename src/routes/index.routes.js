import { Router } from "express";
import passport from "passport";
import { isAuthenticated, isAdmin } from "../helpers/auth";
import { renderHome, renderUser, createUser, editUser, deleteUser, register } from "../controllers/users.controller";
import { createLot, editLot, renderEditLot, deleteLot, renderChart, renderAnalysis, renderLot, renderEgg } from "../controllers/lots.controller";
import { renderEditEgg, editEgg } from "../controllers/eggs.controller";
import { createCandling, renderCandlings, renderCandlingsCamera, renderCandlingsImage, renderGallery } from "../controllers/candling.controller";

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
router.get("/users", [isAuthenticated], renderUser);
router.post("/users/add", [isAuthenticated], createUser);
router.post("/users/edit", [isAuthenticated], editUser);
router.get("/users/:id/delete", [isAuthenticated], deleteUser);

/*-- Lotes --*/
router.get("/lots", [isAuthenticated], renderLot);
router.post("/lots/add", [isAuthenticated], createLot);
router.get("/lots/:id/edit", [isAuthenticated], renderEditLot);
router.post("/lots/:id/edit", [isAuthenticated], editLot);
router.get("/lots/:id/delete", [isAuthenticated], deleteLot);

router.get("/lots/:id/view", [isAuthenticated], renderEgg);

/*-- huevos --*/
router.get("/eggs/:id/view", renderEditEgg);
router.post("/eggs/:id/edit", editEgg);

//Rutas de Restablecimiento de contraseña
//router.post("/resetPassword", resetPassword);


/*-- Ovoscopia --*/
//router.get("/candling", renderCandlings);
router.get("/candling/:id", renderCandlings);

router.post("/uploadImage", createCandling);

/*-- Analisis --*/
router.get("/camera", [isAuthenticated], renderCandlingsCamera);

router.get("/image", [isAuthenticated], renderCandlingsImage);

router.post("/upload", async (req, res) => {
  const name = req.user.name;
  res.redirect("/image", { name: name });
});

/*-- Gallery --*/
router.get("/gallery", renderGallery);


export default router;