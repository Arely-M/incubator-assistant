import { Schema, model } from "mongoose";

const eggsSchema = new Schema(
    {
        number: {
            type: Number,
            required: [true, "El número de huevo es requerido!"]
        },
        transparency: {
            type: Number,
        },
        width: Number,
        height: Number,
        status: {
            type: String,
            required: [true, "El estado del huevo es requerido!"],
        },
        id_lot: String,

    },
    {
        timestamps: false,
        versionKey: false,
    }
);

export default model("eggs", eggsSchema);