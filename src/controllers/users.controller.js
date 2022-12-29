import Users from "../models/users";
import Role from "../models/role";
//import { transporter } from "../config/mailer";

export const register = async (req, res) => {
  try {
    var pass = "";
    const emailUser = await Users.find({ email: req.body.email }).limit(1).count();
    if (emailUser == 1) {
      req.flash("error_msg", "Ya existe un usuario asociado a este correo electrónico.");
      res.redirect("/");
    } else {
      const idRole = await Role.find({ role: 'Usuario' }).limit(1).lean();
      const users = new Users({
        name: req.body.name,
        password: "",
        email: req.body.email,
        role: idRole[0]._id,
      });
      console.log(req.body.registerpass1);
      pass = await users.encryptPassword(req.body.registerpass1);
      console.log(pass);
      users.password = pass;
      const savedUser = await users.save();
      req.flash("success_msg", "Registro exitoso!");
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

export const renderHome = async (req, res) => {
  const user = await Users.find({ _id: req.user.id });
  const role = await Role.find().lean();
  const idUser = user[0].role;
  const name = req.user.name;

  res.render("home", {
    role: role,
    user: idUser,
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

export const renderUser = async (req, res) => {
  const user = await Users.find({ _id: req.user.id });
  const userRole = user[0].role;
  const users = await Users.find().lean();
  const role = await Role.find().lean();

  const idUser = user[0].role;
  const name = req.user.name;

  for (var i = 0; i < users.length; i++) {
    const role = await Role.find({ _id: users[i].role }).limit(1).lean();
    users[i].role = role[0].role;
  }

  res.render("user", {
    users: users,
    user: idUser,
    role: role,
    userRole: userRole,
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

export const createUser = async (req, res) => {
  try {
    var j = 0;
    var pass = "";
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    const emailUser = await Users.find({ email: req.body.email }).limit(1).count();

    if (emailUser == 1) {
      req.flash("error_msg", "Ya existe un usuario asociado a este correo electrónico.");
      //res.redirect("/users");
    } else {
      const users = new Users({
        name: req.body.name,
        password: "",
        email: req.body.email,
        role: req.body.role,
      });

      for (var i = 1; i <= 8; i++) {
        var char = Math.floor(Math.random() * str.length + 1);
        pass += str.charAt(char);
      }

      await transporter.sendMail({
        from: '"UTI" <storepcbuild.2020@gmail.com>',
        to: req.body.email,
        subject: "Contraseña asignada ✔",
        html: `<b>BIENVENIDO AL ADMINISTRADOR DE UTI</b>
              <hr>
              <p>Hola! te saluda UTI, has sido invitado como moderador para la administracion del ingreso de preguntas y
              respuestas frecuentes, que poseen los estudiantes de su facultad, si ha habido algun error contactese
              con el administrador Lic. Andres Carvajal</p>
              <p>Su contraseña para el administrador de UTI es: <b>${pass}</b></p>
        `,
      });

      pass = await users.encryptPassword(pass);

      users.password = pass;
      const savedUser = await users.save();

      req.flash("success_msg", "Registro exitoso!");
      res.redirect("/users");
    }
  } catch (error) {
    console.log(error);
  }
};

export const editUser = async (req, res) => {
  try {
    var j = 0;
    var pass = "";
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";
    const id = req.body.id1;
    const users = new Users();

    for (var i = 1; i <= 8; i++) {
      var char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }

    var passw = await users.encryptPassword(pass);
    await Users.findByIdAndUpdate(id, {
      name: req.body.name1,
      email: req.body.email1,
      //password: passw,
      role: req.body.rol1,
    });
    /*await transporter.sendMail({
      from: '"UTI" <storepcbuild.2020@gmail.com>',
      to: req.body.email,
      subject: "Permisos modificados ✔",
      html: `<b>BIENVENIDO AL ADMINISTRADOR DE UTI</b>
            <hr>
            <p>Hola! te saluda UTI, por decision de mi administrador su permiso ha sido modificado,
            si ha habido algun error contactese con el administrador</p>
            <p>Su nueva contraseña es: <b>${pass}</b></p>
      `,
    });*/
    req.flash("success_msg", "Actualización exitosa!");
    res.redirect("/users");
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    /*const users = await Users.find({ _id: id }).limit(1).lean();
    await transporter.sendMail({
      from: '"UTI" <storepcbuild.2020@gmail.com>',
      to: users[0].email,
      subject: "Permisos eliminados ✔",
      html: `<b>BIENVENIDO AL ADMINISTRADOR DE UTI</b>
            <hr>
            <p>Hola! te saluda UTI, por motivos de seguridad, su usuario ha sido revocado de mi panel de administracion,
            gracias por colaborar, ahora si me disculpas tengo informacion que procesar.</p>
            <p>Nos vemos pronto</p>
      `,
    });*/
    await Users.findByIdAndDelete(id);
    res.redirect("/users");
  } catch (error) {
    console.log(error.message);
  }
};

// //Restablecimiento de contraseña
// export const resetPassword = async (req, res) => {
//   try {
//     var pass = "";
//     var str =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";
//     var email = "";
//     var emailConfirm = "";

//     email = req.body.email1;
//     emailConfirm = req.body.emailConfirm;
//     const users = await Users.findOne({ email: req.body.email1 });
//     console.log(users);
//     if (users === null || users === undefined) {
//       req.flash(
//         "error_msg",
//         "El correo ingresado no coincide con ninguno existente, Intente de nuevo."
//       );
//       res.redirect("/");
//     } else {
//       if (email == emailConfirm) {
//         const user = await Users.find({ email: req.body.email1 })
//           .limit(1)
//           .lean();
//         for (var i = 1; i <= 8; i++) {
//           var char = Math.floor(Math.random() * str.length + 1);
//           pass += str.charAt(char);
//         }
//         var passw = await users.encryptPassword(pass);
//         const isReset = await Users.findByIdAndUpdate(user[0]._id, {
//           password: passw,
//         });
//         if (isReset) {
//           await transporter.sendMail({
//             from: '"UTI" <storepcbuild.2020@gmail.com>',
//             to: req.body.email1,
//             subject: "Restablecimiento de contraseña ✔",
//             html: `<b>BIENVENIDO AL ADMINISTRADOR DE UTI</b>
//                   <hr>
//                   <p>Hola! te saluda UTI, me he enterado que se te ha olvidado la contraseña
//                   por motivos de seguridad la contraseña antes dada es inaccesible para mi, pero no estes triste
//                   tu amiga UTI te ayudara con otra, pero ¡shhh...! no le digas al administrador,
//                   revisa tu correo para saber tu nueva contraseña.</p>
//                   <p>Su nueva contraseña es: <b>${pass}</b></p>
//             `,
//           });
//         }
//         req.flash("success_msg", "Se ha restablecido la contraseña exitosamente.");
//         res.redirect("/");
//       } else {
//         req.flash(
//           "error_msg",
//           "Su correo de confirmacion no coincide, Intente de nuevo."
//         );
//         res.redirect("/");
//       }
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };
