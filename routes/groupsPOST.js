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
  const {
    name,
    date,
    place,
    note,
  } = req.body;
  let errors = [];

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
  if (errors.length > 0) {
    res.render('createGroup', {
      errors,
      name,
      date,
      place,
      note
    });
  } else {
    Group.findOne({
        name: name
      })
      .then(group => {
        if (group) {
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
          const newGroup = new Group({
            name,
            date,
            place,
            note,
          });
          newGroup.save()
            .then(group => {
              req.flash(
                'success_msg',
                'Creaste el grupo.'
              );
              res.render('createGroup');
            });
          newGroup.users.push({
            'userID': req.user.id,
          });
          newGroup.admin = req.user.id;
        }
      });
  }
});

// Página del grupo (POST)
router.post('/editGroup', ensureAuthenticated, (req, res) => {
  const {
    id,
    name,
    date,
    place,
    note,
    mode,
  } = req.body;
  console.log(req.body)

  Group.findById(req.body.id, function (err, result) {
    if (err) throw err;
    console.log(result)
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

    // Guardado.
    result.save(function (err) {
      req.flash(
        'success_msg',
        'Se modifico el grupo'
      );
      res.redirect(`/editGroups/${req.body.id}`)
    });

  })
});

// Página del grupo
router.post('/addUser/:idGroup', ensureAuthenticated, (req, res) => {

  const {
    username,
  } = req.body;

  if (!username) {
    req.flash(
      'error_msg',
      'Ingrese usuario.'
    );
    res.redirect(`/addUser/${req.params.idGroup}`)
  } else if (username) {
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
    if (err) throw err;
    //Resultados.
    console.log(result);
    result.raters.push(req.user.id);
    console.log("pusheadp a Raters  =>" + req.user.id)
    result.save(res.redirect(`/groups/${req.params.idGroup}`));

  })
})

module.exports = router;