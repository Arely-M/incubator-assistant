import Candlings from "../models/candling";
const path = require("path");
const { randomNumber } = require("../helpers/libs");
const fs = require('fs-extra');

export const renderCandlings = async (req, res) => {
    try {
        const candling = await Candlings.findById(req.params.id).lean();
        // const name = req.user.name;

        res.render("candling", {
            candling: candling,
            /*name: name*/
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const createCandling = async (req, res) => {
    try {
        //const idEgg = await Candlings.find({ "id_egg": req.user.id });
        const imgUrl = randomNumber();
        console.log(imgUrl);
        const imageTempPath = req.file.path;
        const ext = path.extname(req.file.originalname).toLocaleLowerCase();
        const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
            await fs.rename(imageTempPath, targetPath);
        }

        res.send("Cool!");
        /*const candling = new Candlings({
            date: req.body.date,
            image: req.body.image,
            status: req.body.status,
            id_egg: req.user.id,
        });
        await candling.save();*/

        /*req.flash("success_msg", "Registro exitoso!");
        res.redirect("/eggs/" + candling.id_egg + "/edit");*/
    } catch (error) {
        console.log(error);
    }
};