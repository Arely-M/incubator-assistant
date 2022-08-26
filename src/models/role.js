import { Schema, model } from "mongoose";

const role = new Schema({
    role: { type: String },
    description: { type: String },
}, {
    timestamps: false,
    versionKey: false,
});

export default model("role", role);