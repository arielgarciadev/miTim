const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');

const {
  ensureAuthenticated,
} = require('../config/auth');

// Cárga modelos
var User = mongoose.model('User');
const Group = require('../models/Group');

// Crear Grupos
router.post('/createGroup', ensureAuthenticated, (req, res) => {
<<<<<<< HEAD

  //Guarda los datos del formulario en constantes.
=======
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
  const {
    name,
    date,
    place,
    note,
  } = req.body;
<<<<<<< HEAD

  //Variable de errores.
  let errors = [];

  //VALIDACIONES
  //Verifica que todos los campos esten completos.
=======
  let errors = [];

>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
  if (!name) {
    errors.push({
      msg: 'Ingrese el nombre del grupo.'
    });
  }
  if (!date) {
    errors.push({
      msg: 'Ingrese la fecha.'
    });
  }
  if (!place) {
    errors.push({
      msg: 'Ingrese el lugar.'
    });
  }
<<<<<<< HEAD
  //Si hubo errores renderiza "register" con los errores.
=======
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
  if (errors.length > 0) {
    res.render('createGroup', {
      errors,
      name,
      date,
      place,
      note
    });
<<<<<<< HEAD
  } 
  //Si no hubo errores busca en la base de datos el nombre del grupo.
  else {
=======
  } else {
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
    Group.findOne({
        name: name
      })
      .then(group => {
<<<<<<< HEAD
        if (group) { //Si existe el grupo, renderiza "createGroup" con el error.
=======
        if (group) {
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
          req.flash(
            'error_msg',
            'Este grupo ya existe.'
          );
          res.render('createGroup', {
            errors,
            name,
            date,
            place,
            note
          })
        } else {
<<<<<<< HEAD
          const newGroup = new Group({ // Si no hubo errores crea un nuevo grupo.
=======
          const newGroup = new Group({
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
            name,
            date,
            place,
            note,
          });
<<<<<<< HEAD
          newGroup.save() // Guarda los datos del grupo en la base de datos.
=======
          newGroup.save()
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
            .then(group => {
              req.flash(
                'success_msg',
                'Creaste el grupo.'
              );
              res.render('createGroup');
            });
          newGroup.users.push({
<<<<<<< HEAD
            'userID': req.user.id, // Pushea el ID del user dentro del array "users" del grupo.
          });
          newGroup.admin = req.user.id; // Modifica el valor de "admin" del grupo por la ID del usuario, para que el creador del grupo sea el administrador.
=======
            'userID': req.user.id,
          });
          newGroup.admin = req.user.id;
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
        }
      });
  }
});

<<<<<<< HEAD
// Solicitud para editar el grupo (POST)
router.post('/editGroup', ensureAuthenticated, (req, res) => {

  //Guarda los datos del formulario en constantes.
=======
// Página del grupo (POST)
router.post('/editGroup', ensureAuthenticated, (req, res) => {
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
  const {
    id,
    name,
    date,
    place,
    note,
    mode,
  } = req.body;
<<<<<<< HEAD

  //Busca en la colección "groups" con el Id del grupo.
  Group.findById(req.body.id, function (err, result) {

    if (err) throw err;
    
=======
  console.log(req.body)

  Group.findById(req.body.id, function (err, result) {
    if (err) throw err;
    console.log(result)
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
    // Quitar espacios en blanco.
    var name = req.body.name.trim();
    var date = req.body.date.trim();
    var place = req.body.place.trim();
    var note = req.body.note
    var mode = req.body.mode
    var id = req.body.id;

    // Validación
    if (!name || !date || !place) {
      req.flash('error', 'Uno o más campos estan vacios.');
      res.redirect(`/editGroups/${req.body.id}`)
      return
    }

    // Remplazo de datos
    result.name = name;
    result.date = date;
    result.place = place;
    result.note = note;
    result.mode = mode;

<<<<<<< HEAD
    // Guarda las modificaciones del grupo y redirije a la pagina de edicion del grupo.
=======
    // Guardado.
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
    result.save(function (err) {
      req.flash(
        'success_msg',
        'Se modifico el grupo'
      );
      res.redirect(`/editGroups/${req.body.id}`)
    });

  })
});

<<<<<<< HEAD
// Solicitud para agregar usuarios al grupo (POST)
router.post('/addUser/:idGroup', ensureAuthenticated, (req, res) => {

  //Guarda los datos del formulario en constantes.
=======
// Página del grupo
router.post('/addUser/:idGroup', ensureAuthenticated, (req, res) => {

>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
  const {
    username,
  } = req.body;

<<<<<<< HEAD
  //VALIDACIONES

  //Verifica si ingresamos el nombre en el formulario.
  // Si no lo hicimos vuelve a la misma página con el error.
=======
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
  if (!username) {
    req.flash(
      'error_msg',
      'Ingrese usuario.'
    );
    res.redirect(`/addUser/${req.params.idGroup}`)
<<<<<<< HEAD
  } 
  // Si ingresamos el usuario lo busca por el usuario en la colección "users".
  else if (username) {
=======
  } else if (username) {
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
    User.findOne({
        username: username
      })
      .then(user => {
        if (!user) {
          req.flash(
            'error_msg',
            'El usuario no existe.'
          );
          res.redirect(`/addUser/${req.params.idGroup}`)
          return;
        } else if (user) {
          Group.findById(req.params.idGroup, function (err, result) {
            if (err) throw err;
            Group.findOne({
              '_id': result.id,
              "users.userID": user.id
            }).then(repetido => {
              console.log("resultado de repetido, abajo")
              console.log(repetido)
              if (repetido) {
                req.flash(
                  'error_msg',
                  'El usuario ya esta en el grupo.'
                );
                res.redirect(`/addUser/${req.params.idGroup}`)
                return
              } else if (!repetido) {
                result.users.push({
                  'response': "idk",
                  'userID': user.id,
                })
                result.save(
                  function (err) {
                    req.flash(
                      'success_msg',
                      'Usuario agregado.'
                    );
                    res.redirect(`/addUser/${req.params.idGroup}`)
                  }
                )
              }
            });
          })
        }
      })
  }
});

router.post('/resetear/:idGroup/', ensureAuthenticated, (req, res) => {

  Group.findById(req.params.idGroup, function (err, result) {
    if (err) throw err
    result.raters = [];
    for (let i = 0; i < result.users.length; i++) {
      result.users[i].response = "idk";
    }
    console.log(result)
    result.save(console.log(result))
  })

  res.redirect(`/groups/${req.params.idGroup}`)
})

// Página de calificaciones (POST)
router.post('/scoreGroup/:idGroup', ensureAuthenticated, (req, res) => {

  const {
    scores,
    usersID,
  } = req.body;
  console.log(scores)
  console.log(usersID)
  for (let i = 0; i < scores.length; i++) {
    User.findById(usersID[i], function (err, result) {
      if (err) throw err;
      //Resultados.
      result.score.push(scores[i]);
      result.save(console.log("Calificado"));
    })
  }
  Group.findById(req.params.idGroup, function (err, result) {
<<<<<<< HEAD
    
    if (err) throw err;
    
    result.raters.push(req.user.id);
    
=======
    if (err) throw err;
    //Resultados.
    console.log(result);
    result.raters.push(req.user.id);
    console.log("pusheadp a Raters  =>" + req.user.id)
>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
    result.save(res.redirect(`/groups/${req.params.idGroup}`));

  })
})

module.exports = router;