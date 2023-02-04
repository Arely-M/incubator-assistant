import { Router } from "express";
import passport from "passport";
import { isAuthenticated, isAdmin } from "../helpers/auth";
import { renderHome, renderUser, resetPassword, createUser, editUser, deleteUser, register, renderAyuda } from "../controllers/users.controller";
import { createLot, editLot, renderEditLot, deleteLot, renderChart, renderAnalysis, renderLot, renderEgg } from "../controllers/lots.controller";
import { renderEditEgg, editEgg } from "../controllers/eggs.controller";
import { createCandling, renderCandlings, renderCandlingsCamera, renderCandlingsImage, renderGallery, renderGalleryImage, deleteGalleryImage, renderInicial, renderMedia, renderFinal, renderInerte } from "../controllers/candling.controller";

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
router.get("/eggs/:id/view", [isAuthenticated], renderEditEgg);
router.post("/eggs/:id/edit", [isAuthenticated], editEgg);

//Rutas de Restablecimiento de contraseña
router.post("/resetPassword", resetPassword);


/*-- Ovoscopia --*/
//router.get("/candling", renderCandlings);
router.get("/candling/:id", [isAuthenticated], renderCandlings);

router.post("/uploadImage/:id", [isAuthenticated], createCandling);

/*-- Analisis --*/
router.get("/camera", [isAuthenticated], renderCandlingsCamera);

router.get("/image", [isAuthenticated], renderCandlingsImage);

router.post("/upload", async (req, res) => {
  const name = req.user.name;
  res.redirect("/image", { name: name });
});

/*-- Gallery --*/
router.get("/gallery", [isAuthenticated], renderGallery);
router.get("/gallery/:image_id", [isAuthenticated], renderGalleryImage);
router.get("/gallery/delete/:image_id", [isAuthenticated], deleteGalleryImage);


router.get("/inicial", [isAuthenticated], renderInicial);
router.get("/media", [isAuthenticated], renderMedia);
router.get("/final", [isAuthenticated], renderFinal);
router.get("/inerte", [isAuthenticated], renderInerte);

router.get("/ayuda", [isAuthenticated], renderAyuda);

export default router;