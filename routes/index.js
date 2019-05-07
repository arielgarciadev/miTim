const express = require('express');
const router = express.Router();
const formidable = require('formidable'),
  http = require('http'),
  util = require('util');
var path = require('path');
var mongoose = require('mongoose');

const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

// Cárga modelos
var User = mongoose.model('User');
const Group = require('../models/Group');

// Página de bienvenida.
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Página de inicio.
router.get('/home', ensureAuthenticated, (req, res) => res.render('home'));

// Página de edición de perfil.
router.get('/createGroup', ensureAuthenticated, (req, res) => res.render('createGroup', {
  user: req.user,
}));

// Página de edición de perfil.
router.get('/editProfile', ensureAuthenticated, (req, res) => res.render('editProfile', {
  user: req.user,
}));

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
            note
        })} else {
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
              res.redirect('/createGroup');
            });
          newGroup.users.push({
            'userID': req.user.id,
          });
          User.findByIdAndUpdate(req.user._id, {
              "$push": {
                "group": {
                  "groupID": newGroup._id,
                  "name": newGroup.name
                }
              }
            }, {
              "new": true,
              "upsert": true
            },
            function (err, managerparent) {
              if (err) throw err;
              console.log(managerparent);
            }
          );

        }
      });
  }
});

// DEMO PARA VER ROLES DE USUARIOS
router.get('/editProfile', ensureAuthenticated, function (req, res) {
  let rolUsuario = "admin";

  if (rolUsuario == "admin") {
    res.render('welcome')
  } else if (rolUsuario == "user") {
    res.render('editProfile', {
      user: req.user,
    })
  }
});

// Página de perfil.
router.get('/profile', ensureAuthenticated, (req, res) => res.render('profile', {
  user: req.user,
}));

router.post('/play', ensureAuthenticated, function (req, res) {

  const {
    idGrupo,
    value,
  } = req.body;

// Modifica el valor de "play" por el valor del botón (Yes, No, por default es IDK)
  User.updateOne({
    'username': req.user.username,
    "group.groupID": idGrupo
  }, {
    '$set': {
      'group.$.play': value,
    }
  }, function (err, result) {
    if (err) throw err;
  })

  res.redirect('/groups');
});

// Página de Grupos.
router.get('/groups', ensureAuthenticated, function (req, res) {
 
  //Busca los grupos asociados al usuario.
  Group.find({
    "users.userID": req.user.id
  }, function (err, result) {
    if (err) throw err;
    //Renderiza y pasa las variables.
    res.render('groups', {
      grupos: result,
      user: req.user,
    })
  })


});

// Cambiar imagen de perfil (POST).
router.post('/editImage', function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req);
  let reqPath = path.join(__dirname, '../');
  let newfilename;
  //Estado "Comienza cuando detecta la subida de la imagen".
  form.on('fileBegin', function (name, file) {
    file.path = reqPath + 'public/upload/' + req.user.username + file.name;
    newfilename = req.user.username + file.name;
  });
  //Estado "Comienza la creacion del archivo en public".
  form.on('file', function (name, file) {
    User.findOneAndUpdate({
        username: req.user.username
      }, {
        'userImage': newfilename
      },
      function (err, result) {
        if (err) {
          console.log(err);
        }
      });
  });
  //Estado "Finalizó la operación".
  form.on('end', function () {
    req.flash('success_msg', 'Tu imagen de perfil ha sido actualizada.');
    res.redirect('/editProfile');
  });
});

// Editar perfil (POST).
router.post('/editProfile', ensureAuthenticated, function (req, res, next) {

  User.findById(req.user.id, function (err, user) {

    // Error
    if (!user) {
      req.flash('error', 'No se encontro el usuario.');
      return res.redirect('/editProfile');
    }

    // Quitar espacios en blanco.
    var email = req.body.email.trim();
    var username = req.body.username.trim();
    var name = req.body.name.trim();

    // Validación
    if (!email || !username || !name) {
      req.flash('error', 'Uno o más campos estan vacios.');
      return res.redirect('/editProfile');
    }

    // Remplazo de datos
    user.email = email;
    user.name = name;
    user.username = username;

    // Guardado.
    user.save(function (err) {

      req.flash(
        'success_msg',
        'Se modifico el perfil'
      );
      //Redirección (Modificado).
      res.redirect('/editProfile')
    });
  });
});

module.exports = router;