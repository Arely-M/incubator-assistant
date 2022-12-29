import Candlings from "../models/candling";
import Users from "../models/users";
import Role from "../models/role";
import Eggs from "../models/eggs";
const path = require("path");
const { randomNumber } = require("../helpers/libs");
const fs = require('fs-extra');

export const renderCandlings = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();
        const idEgg = req.params.id;
        const e = await Eggs.find({ _id: idEgg });
        const name = req.user.name;
        const idUser = user[0].role;

        res.render("candling", {
            id_lot: e[0].id_lot,
            user: idUser,
            role: role,
            name: name,
            helpers: {
                ifCond: function (v1, operator, v2, options) {
                    switch (operator) {
                        case "==":
                            return v1 == v2 ? options.fn(this) : options.inverse(this);
                        case "===":
                            return v1 === v2 ? options.fn(this) : options.inverse(this);
                        case "!=":
                            return v1 != v2 ? options.fn(this) : options.inverse(this);
                        case "!==":
                            return v1 !== v2 ? options.fn(this) : options.inverse(this);
                        case "<":
                            return v1 < v2 ? options.fn(this) : options.inverse(this);
                        case "<=":
                            return v1 <= v2 ? options.fn(this) : options.inverse(this);
                        case ">":
                            return v1 > v2 ? options.fn(this) : options.inverse(this);
                        case ">=":
                            return v1 >= v2 ? options.fn(this) : options.inverse(this);
                        case "&&":
                            return v1 && v2 ? options.fn(this) : options.inverse(this);
                        case "||":
                            return v1 || v2 ? options.fn(this) : options.inverse(this);
                        default:
                            return options.inverse(this);
                    }
                },
            },
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const createCandling = (req, res) => {
    try {
        const saveImage = async () => {
            //const idEgg = await Candlings.find({ "id_egg": req.user.id });
            const imgUrl = randomNumber();
            const images = await Candlings.find({ filename: imgUrl });
            if (images.length > 0) {
                saveImage();
            }

            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLocaleLowerCase();
            const targetPath = path.resolve(`src/public/uploads/${imgUrl}${ext}`);

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
                await fs.rename(imageTempPath, targetPath);
                const candling = new Candlings({
                    filename: imgUrl + ext,
                    status: 1,//req.body.status,
                    id_egg: "1",//req.user.id,
                });
                const candlingSave = await candling.save();
                req.flash("success_msg", "Registro exitoso!");
                res.redirect("/lots");
            } else {
                await fs.unlink(imageTempPath);
                req.flash("error_msg", "Algo fallo!");
                res.redirect("/lots");
            }
        }
        saveImage();
        //res.redirect("/eggs/" + candling.id_egg + "/edit");
    } catch (error) {
        console.log(error);
    }
};

export const renderCandlingsCamera = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();

        const name = req.user.name;
        const idUser = user[0].role;

        res.render("camera", {
            user: idUser,
            role: role,
            name: name,
            helpers: {
                ifCond: function (v1, operator, v2, options) {
                    switch (operator) {
                        case "==":
                            return v1 == v2 ? options.fn(this) : options.inverse(this);
                        case "===":
                            return v1 === v2 ? options.fn(this) : options.inverse(this);
                        case "!=":
                            return v1 != v2 ? options.fn(this) : options.inverse(this);
                        case "!==":
                            return v1 !== v2 ? options.fn(this) : options.inverse(this);
                        case "<":
                            return v1 < v2 ? options.fn(this) : options.inverse(this);
                        case "<=":
                            return v1 <= v2 ? options.fn(this) : options.inverse(this);
                        case ">":
                            return v1 > v2 ? options.fn(this) : options.inverse(this);
                        case ">=":
                            return v1 >= v2 ? options.fn(this) : options.inverse(this);
                        case "&&":
                            return v1 && v2 ? options.fn(this) : options.inverse(this);
                        case "||":
                            return v1 || v2 ? options.fn(this) : options.inverse(this);
                        default:
                            return options.inverse(this);
                    }
                },
            },
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const renderCandlingsImage = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();

        const name = req.user.name;
        const idUser = user[0].role;

        res.render("image", {
            user: idUser,
            role: role,
            name: name,
            helpers: {
                ifCond: function (v1, operator, v2, options) {
                    switch (operator) {
                        case "==":
                            return v1 == v2 ? options.fn(this) : options.inverse(this);
                        case "===":
                            return v1 === v2 ? options.fn(this) : options.inverse(this);
                        case "!=":
                            return v1 != v2 ? options.fn(this) : options.inverse(this);
                        case "!==":
                            return v1 !== v2 ? options.fn(this) : options.inverse(this);
                        case "<":
                            return v1 < v2 ? options.fn(this) : options.inverse(this);
                        case "<=":
                            return v1 <= v2 ? options.fn(this) : options.inverse(this);
                        case ">":
                            return v1 > v2 ? options.fn(this) : options.inverse(this);
                        case ">=":
                            return v1 >= v2 ? options.fn(this) : options.inverse(this);
                        case "&&":
                            return v1 && v2 ? options.fn(this) : options.inverse(this);
                        case "||":
                            return v1 || v2 ? options.fn(this) : options.inverse(this);
                        default:
                            return options.inverse(this);
                    }
                },
            },
        });
    } catch (error) {
        console.log(error.message);
    }
};