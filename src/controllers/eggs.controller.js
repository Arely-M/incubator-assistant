import Eggs from "../models/eggs";

export const renderEditEgg = async (req, res) => {
    try {        
        const egg = await Eggs.findById(req.params.id).lean();        
        res.render("egg", {
            egg: egg,         
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

        const egg = new Eggs({
            number: req.body.number,
            transparency: req.body.transparency,
            width: req.body.width,
            height: req.body.height,
        });
        await egg.save();
        req.flash("success_msg", "Registro exitoso!");
        res.redirect("/egg");

    } catch (error) {
        console.log(error);
    }
};