import Eggs from "../models/eggs";

export const renderEgg = async (req, res) => {
    try {
        const eggs = await Eggs.findById(req.params.id).lean();
        res.render("egg", { eggs: eggs });
    } catch (error) {
        console.log(error.message);
    }
};