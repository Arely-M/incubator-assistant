import Eggs from "../models/eggs";
import Users from "../models/users";
import Role from "../models/role";
import Candlings from "../models/candling";
import Lote from "../models/lots";

export const renderEditEgg = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();
        const egg = await Eggs.findById(req.params.id).lean();
        const candlings = await Candlings.find({ id_egg: req.params.id }).lean();
        const lot = await Lote.find({ _id: egg.id_lot }).lean();

        const idUser = user[0].role;
        const name = req.user.name;

        res.render("egg", {
            user: idUser,
            role: role,
            egg: egg,
            candlings: candlings,
            lot: lot[0],
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

export const editEgg = async (req, res) => {
    try {
        const id = req.params.id;

        const e = await Eggs.findByIdAndUpdate(id, {
            number: req.body.number,
            transparency: req.body.transparency,
            width: req.body.width,
            height: req.body.height
        });
        req.flash("success_msg", "Actualización exitosa!");
        res.redirect("/lots/" + e.id_lot + "/view");
    } catch (error) {
        console.log(error);
    }
};