const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const formidable = require('formidable'),
  http = require('http'),
  util = require('util');
var path = require('path');

const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

// Cárga modelos
const Group = require('../models/Group');
const User = mongoose.model('User');

// Página de bienvenida.
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Página de inicio.
router.get('/home', ensureAuthenticated, (req, res) => {

  //Si lastGroup(Se guarda en user cauando se hace un "GET" a la dirección del grupo) esta vacio renderiza "Home"
  if (req.user.lastGroup == "") {
    res.render("home")
    return;
  }
  //Si lastGroup existe renderiza el grupo.
  res.redirect(`/groups/${req.user.lastGroup}`)

});

// Página de perfil.
router.get('/profile', ensureAuthenticated, (req, res) => res.render('profile', {
  user: req.user,
}));

// Solicitud POST del formulario "Juega o no juega".
router.post('/play', ensureAuthenticated, function (req, res) {
  //Guarda el ID del grupo, y el valor ("yes" o "no") en constantes.
  const {
    idGrupo,
    value,
  } = req.body;

  //Busca en la colección "groups" el ID del grupo y en userID el id del usuario. 
  Group.updateOne({
    '_id': mongoose.Types.ObjectId(idGrupo),
    "users.userID": req.user.id
  }, {
    '$set': {
      'users.$.response': value, //Remplaza el valor de "response" del usuario en ese grupo por la respuesta.
    }
  }, function (err, result) {
    if (err) throw err;
  })
  res.redirect('/groups'); //Redirige nuevamante a /groups.
});

// Página de Grupos.
router.get('/groups', ensureAuthenticated, function (req, res) {

  //Busca los grupos asociados al usuario.
  Group.find({
    "users.userID": req.user.id
  }, function (err, result) {
    if (err) throw err;

    //Renderiza y pasa el contenido de las variables.
    res.render('groups', {
      grupos: result,
      user: req.user,
    })
  })
});

// Solicitud para cambiar imagen de perfil (POST).
router.post('/editImage', function (req, res) {

  //Formidable
  var form = new formidable.IncomingForm(); 
  form.parse(req);
  let reqPath = path.join(__dirname, '../');
  let newfilename;

  //Estado "Comienza cuando detecta la subida de la imagen".
  form.on('fileBegin', function (name, file) {
    //Crea la ruta del archivo (Imagen) con el nombre nuevo (nombre de usuario + el nombre del archivo).
    file.path = reqPath + 'public/upload/' + req.user.username + file.name; 
    newfilename = req.user.username + file.name;
  });

  //Estado "Comienza la creacion del archivo en public".
  form.on('file', function (name, file) {
    
    //Busca el nombre del usuario en la colección "users".
    User.findOneAndUpdate({
        username: req.user.username
      }, {
        'userImage': newfilename //Remplaza el valor de "userImage" por el nuevo nombre del archivo. 
      },
      function (err, result) {
        if (err) {
          console.log(err);
        }
      });
  });

  //Estado "Finalizó la operación". Renderiza nuevamentes "/editProfile".
  form.on('end', function () {
    req.flash('success_msg', 'Tu imagen de perfil ha sido actualizada.');
    res.redirect('/editProfile');
  });
});

// Solicitud POST para editar los datos del perfil del usuario.
router.post('/editProfile', ensureAuthenticated, function (req, res, next) {

  //Busca en la colección "users" por la ID del usuario.
  User.findById(req.user.id, function (err, user) {

    // Si el usuario no existe redirije nuevamente a "editProfile" con el error.
    if (!user) {
      req.flash('error', 'No se encontro el usuario.');
      return res.redirect('/editProfile');
    }

    // Quita los espacios en blanco.
    var email = req.body.email.trim();
    var username = req.body.username.trim();
    var name = req.body.name.trim();

    // Valida que los campos esten completos. Si no lo estan redirije nuevamente a "editProfile" con el error.
    if (!email || !username || !name) {
      req.flash('error', 'Uno o más campos estan vacios.');
      return res.redirect('/editProfile');
    }

    // Remplazo de datos del usuario.
    user.email = email;
    user.name = name;
    user.username = username;

    // Guardado de los datos.
    user.save(function (err) {

      //Rederije nuevamente a "editProfile" con el "success_msg".
      req.flash(
        'success_msg',
        'Se modifico el perfil'
      );
      res.redirect('/editProfile')
    });
  });
});

module.exports = router;