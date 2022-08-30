import { Schema, model } from "mongoose";

const lotsSchema = new Schema(
    {
        number: {
            type: Number,
            required: [true, "El número de lote es requerido!"]
        },
        date: {
            type: Date,
            required: [true, "La fecha es requerida!"]
        },
        amount: {
            type: Number,
            min: [1, "La cantidad debe ser mayor a 0, got {VALUE}"],
            required: [true, "La cantidad es requerida!"]
        },
        comment: String,
        status: {
            type: String,
            required: [true, "El estado del lote es requerido!"],
        },
        id_user: String,

    },
    {
        timestamps: false,
        versionKey: false,
    }
);

export default model("lots", lotsSchema);