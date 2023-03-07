import Candlings from "../models/candling";
import Users from "../models/users";
import Role from "../models/role";
import Eggs from "../models/eggs";
import Lots from "../models/lots"
const path = require("path");
const { randomNumber } = require("../helpers/libs");
const fs = require('fs-extra');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'da3mkibwt',
    api_key: '561672886247519',
    api_secret: 'pP_7rEP-p73gYhBvwWbkSIdbYPU',
});


export const renderCandlings = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();
        const idEgg = req.params.id;
        const e = await Eggs.find({ _id: idEgg });
        const name = req.user.name;
        const idUser = user[0].role;

        const lote = await Lots.findById(e[0].id_lot).lean();
        console.log(lote.startDate);

        res.render("candling", {
            id_lot: e[0].id_lot,
            id_egg: idEgg,
            user: idUser,
            role: role,
            name: name,
            fechaLote: lote.startDate.toISOString().substring(0, 10),
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
            const egg = await Eggs.findById(req.params.id).lean();
            const imgUrl = randomNumber();
            const images = await Candlings.find({ filename: imgUrl });
            if (images.length > 0) {
                saveImage();
            }

            const imageTempPath = req.file.path;
            console.log(req.file.path);
            const ext = path.extname(req.file.originalname).toLocaleLowerCase();
            //const targetPath = path.resolve(`src/public/uploads/${imgUrl}${ext}`);

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
                const result = await cloudinary.v2.uploader.upload(req.file.path);
                //await fs.rename(imageTempPath, targetPath);
                console.log(result);
                const candling = new Candlings({
                    filename: imgUrl + ext,
                    imageURL: result.url,
                    status: req.body.status,
                    day: req.body.day,
                    id_egg: egg._id,
                    public_id: result.public_id,
                });
                const e = await Eggs.findByIdAndUpdate(egg._id, {
                    status: req.body.status,
                });
                console.log(req.body.status);
                const candlingSave = await candling.save();
                await fs.unlink(req.file.path);

                req.flash("success_msg", "Registro exitoso!");
                res.redirect("/lots/" + egg.id_lot + "/view");
            } else {
                /*await fs.unlink(imageTempPath);*/
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

export const renderGallery = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();
        const name = req.user.name;
        const idUser = user[0].role;

        const images = await Candlings.find({ $or: [{ status: "1" }, { status: "2" }, { status: "3" }, { status: "4" }, { status: "5" }] }).sort({ timestamp: -1 });

        res.render("gallery", {
            user: idUser,
            role: role,
            name: name,
            images: images,
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

export const renderGalleryImage = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();
        const name = req.user.name;
        const idUser = user[0].role;

        const image = await Candlings.findOne({ filename: { $regex: req.params.image_id } });

        res.render("galleryImage", {
            user: idUser,
            role: role,
            name: name,
            image: image,
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

export const deleteGalleryImage = async (req, res) => {
    try {
        const { image_id } = req.params;
        const image = await Candlings.findByIdAndDelete(image_id);
        const result = await cloudinary.v2.uploader.destroy(image.public_id);
        console.log(result);
        res.redirect('/gallery');

    } catch (error) {
        console.log(error.message);
    }
};

export const renderInicial = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();
        const name = req.user.name;
        const idUser = user[0].role;

        const imagesInicial = await Candlings.find({ $or: [{ status: "1" }, { status: "5" }] }).sort({ timestamp: -1 });

        res.render("inicial", {
            user: idUser,
            role: role,
            name: name,
            images: imagesInicial,
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

export const renderMedia = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();
        const name = req.user.name;
        const idUser = user[0].role;

        const imagesMedia = await Candlings.find({ status: "2" }).sort({ timestamp: -1 });

        res.render("media", {
            user: idUser,
            role: role,
            name: name,
            images: imagesMedia,
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

export const renderFinal = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();
        const name = req.user.name;
        const idUser = user[0].role;

        const imagesFinal = await Candlings.find({ status: "3" }).sort({ timestamp: -1 });

        res.render("final", {
            user: idUser,
            role: role,
            name: name,
            images: imagesFinal,
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

export const renderInerte = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();
        const name = req.user.name;
        const idUser = user[0].role;

        const imagesInerte = await Candlings.find({ status: "4" }).sort({ timestamp: -1 });

        res.render("inerte", {
            user: idUser,
            role: role,
            name: name,
            images: imagesInerte,
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