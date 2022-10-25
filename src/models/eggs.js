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
        id_lot: String,

    },
    {
        timestamps: false,
        versionKey: false,
    }
);

export default model("eggs", eggsSchema);