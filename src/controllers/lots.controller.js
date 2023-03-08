import Lots from "../models/lots";
import Users from "../models/users";
import Eggs from "../models/eggs";
import Role from "../models/role";


export const renderLot = async (req, res) => {
    const user = await Users.find({ _id: req.user.id });
    const role = await Role.find().lean();
    const lots = await Lots.find({ id_user: req.user.id }).lean();
    for (let i = 0; i < lots.length; i++) {
        lots[i].startDate = lots[i].startDate.toISOString().substring(0, 10);
        lots[i].endDate = lots[i].endDate.toISOString().substring(0, 10);
    }

    const idUser = user[0].role;
    const name = req.user.name;

    res.render("lot", {
        user: idUser,
        role: role,
        lots: lots,
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
};

export const createLot = async (req, res) => {
    try {
        var count = 0;
        const countLot = await Lots.find({ "id_user": req.user.id }).lean();
        if (countLot === undefined || countLot.length === 0) {
            count = 1;
        } else {
            const countLot = await Lots.find({ "id_user": req.user.id }).sort({ $natural: -1 }).limit(1);
            count = countLot[0].number + 1;
        }
        const lots = new Lots({
            number: count,
            lotName: req.body.lotName,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
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
                transparency: 0,
                width: 0,
                height: 0,
                status: "1",
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

export const renderEditLot = async (req, res) => {
    const user = await Users.find({ _id: req.user.id });
    const role = await Role.find().lean();
    const lot = await Lots.findById(req.params.id).lean();

    lot.startDate = lot.startDate.toISOString().substring(0, 10);
    lot.endDate = lot.endDate.toISOString().substring(0, 10);

    const idUser = user[0].role;
    const name = req.user.name;

    res.render("lotEdit", {
        user: idUser,
        role: role,
        lot: lot,
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
};

export const editLot = async (req, res) => {
    try {
        const id = req.params.id;

        const lot = await Lots.findById(id).limit(1);
        const newAmount = req.body.amount - lot.amount;
        const newAmount1 = lot.amount - req.body.amount;

        if (lot.amount > req.body.amount) {
            for (let i = 1; i <= newAmount1; i++) {
                const egg = await Eggs.find({ id_lot: id }).sort({ $natural: -1 }).limit(1);
                await Eggs.findByIdAndDelete(egg[0].id);
            }
        } else {
            for (let i = 1; i <= newAmount; i++) {
                const eggNumber = await Eggs.find({ id_lot: id }).sort({ $natural: -1 }).limit(1);
                const egg = new Eggs({
                    number: eggNumber[0].number + 1,
                    transparency: 0,
                    width: 0,
                    height: 0,
                    id_lot: id,
                });
                await egg.save();
            }
        }
        await Lots.findByIdAndUpdate(id, {
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            amount: req.body.amount,
            status: req.body.status,
            comment: req.body.comment
        });
        req.flash("success_msg", "Actualización exitosa!");
        res.redirect("/lots");
    } catch (error) {
        console.log(error.message);
    }
};

export const deleteLot = async (req, res) => {
    try {
        const { id } = req.params;
        await Lots.findByIdAndDelete(id);
        await Eggs.remove({ "id_lot": id });

        res.redirect("/lots");
    } catch (error) {
        console.log(error.message);
    }
};

export const renderChart = async (req, res) => {
    const user = await Users.find({ _id: req.user.id });
    const role = await Role.find().lean();
    const idUser = user[0].role;
    const name = req.user.name;

    res.render("chart", {
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
};

export const renderEgg = async (req, res) => {
    try {
        const user = await Users.find({ _id: req.user.id });
        const role = await Role.find().lean();
        const idUser = user[0].role;
        const eggs = await Eggs.find({ id_lot: req.params.id }).lean();
        const name = req.user.name;

        const lot = await Lots.findById({ _id: eggs[0].id_lot }).lean();
        //lot.startDate = lot.startDate.toISOString().substring(0, 10);

        var countExitos = 0;
        var countInfertiles = 0;
        var countInertes = 0;

        for (let i = 0; i < eggs.length; i++) {
            if (eggs[i].status == "1" || eggs[i].status == "2" || eggs[i].status == "3") {
                countExitos = countExitos + 1;
            }
            if (eggs[i].status === "4") {
                countInertes = countInertes + 1;
            }
            if (eggs[i].status === "5") {
                countInfertiles = countInfertiles + 1;
            }
        }

        res.render("eggs", {
            user: idUser,
            role: role,
            eggs: eggs,
            name: name,
            lot: lot,
            countExitos: countExitos,
            countInfertiles: countInfertiles,
            countInertes: countInertes,
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