import Lots from "../models/lots";
import Users from "../models/users";
import Eggs from "../models/eggs";
import Role from "../models/role";


export const renderLot = async (req, res) => {
    const user = await Users.find({ _id: req.user.id });
    const lots = await Lots.find().lean();
    for (let i = 0; i < lots.length; i++) {
        lots[i].date = lots[i].date.toISOString().substring(0, 10);
    }
    const idUser = user[0].role;
    res.render("lot", {
        user: idUser,
        lots: lots,
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
};

export const createLot = async (req, res) => {
    try {
        const lots = new Lots({
            number: req.body.number,
            date: req.body.date,
            amount: req.body.amount,
            comment: req.body.comment,
            status: "1",
            id_user: req.user.id,
        });
        await lots.save();

        const lot = await Lots.find().sort({ $natural: -1 }).limit(1);

        for (let i = 0; i < req.body.amount; i++) {
            const egg = new Eggs({
                number: i + 1,
                transparency: "",
                width: "",
                height: "",
                id_lot: lot[0]._id,
            });
            await egg.save();
        }

        req.flash("success_msg", "Registro exitoso!");
        res.redirect("/lots");

    } catch (error) {
        console.log(error);
    }
};

export const renderChart = async (req, res) => {
    const user = await Users.find({ _id: req.user.id });
    const role = await Role.find().lean();
    const idUser = user[0].role;

    res.render("chart", {
        role: role,
        user: idUser,
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
};

export const renderEgg = async (req, res) => {
    try {
        const eggs = await Eggs.find({ id_lot: req.params.id }).lean();
        console.log(req.params.id);
        res.render("egg", {
            eggs: eggs,
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