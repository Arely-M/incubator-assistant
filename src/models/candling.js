import { Schema, model } from "mongoose";

const candlingSchema = new Schema(
    {
        date: Date,
        image: {
            type: Buffer,
            contentType: String,
        },
        status: Number,
        id_egg: String,

    },
    {
        timestamps: false,
        versionKey: false,
    }
);

export default model("candling", candlingSchema);