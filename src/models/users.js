import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const users = new Schema(
  {
    email: { type: String, required: [true, "El email es obligatorio!"] },
    password: { type: String, required: [true, "La password es obligatoria!"] },
    name: { type: String, required: [true, "El nombre es obligatoria!"], },
    role: { type: String, required: [true, "El rol es obligatorio!"] },

  },
  {
    timestamps: false,
    versionKey: false,
  }
);

//Cifrar contraseña
users.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hash(password, salt);
  return hash;
};

//iniciar sesion
users.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default model("users", users);
