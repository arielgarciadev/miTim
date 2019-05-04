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

// Página de bienvenida.
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Página de inicio.
router.get('/home', ensureAuthenticated, (req, res) => res.render('home'));

// Página de edición de perfil.
router.get('/editProfile', ensureAuthenticated, (req, res) => res.render('editProfile', {
   user: req.user,
}));

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

// Página de Grupos.
router.get('/groups', ensureAuthenticated, function (req, res) {
  //Asigna al array "grupos" grupos del usuario.
  var grupos = [];
  grupos = req.user.group;
  //Busca el usuario.
  User.find({
    username: {
      $ne: req.user.username
    }
  }, function (err, result) {
    if (err) throw err;
    //Renderiza y pasa las variables.
    res.render('groups', {
      grupos: grupos,
      user: req.user,
    });
  });
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
  form.on('end', function() {
    req.flash('success_msg', 'Tu imagen de perfil ha sido actualizada.');
    res.redirect('/editProfile');
  });  
});

// Editar perfil (POST).
router.post('/editProfile', ensureAuthenticated, function(req, res, next){

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