import { Schema, model } from "mongoose";
const path = require('path');

const candlingSchema = new Schema(
    {
        filename: String,
        timestamps: { type: Date, default: Date.now },
        status: Number,
        id_egg: String,

    },
    {
        versionKey: false,
    }
);

candlingSchema.virtual('uniqueId').get(function () {
    return this.filename.replace(path.extname(this.filename, ''))
});

export default model("candling", candlingSchema);