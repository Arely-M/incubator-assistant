import Lots from "../models/lots";
import Users from "../models/users";

export const renderLot = async (req, res) => {
    const user = await Users.find({ _id: req.user.id });
    const idUser = user[0].role;
    res.render("lot", {
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
        console.log(req.body.date);
        await lots.save();

        req.flash("success_msg", "Registro exitoso!");
        res.redirect("/lots");

    } catch (error) {
        console.log(error);
    }
};
