const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var mongoose = require('mongoose');

<<<<<<< HEAD
=======
var mongoose = require('mongoose');

>>>>>>> 4de7dab65030dad48c97b4cb95bd16ef7dc5f5c9
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

// Cárga modelos
var User = mongoose.model('User');

// Página de logueo.
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Página de registro.
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Registro (Solicitud POST)
router.post('/register', (req, res) => {

  //Guarda los datos del formulario en constantes.
  const {
    username,
    name,
    email,
    password,
    password2
  } = req.body;

  //Variable de errores.
  let errors = [];

  //VALIDACIONES
  //Verifica que todos los campos esten completos.
  if (!username || !name || !email || !password || !password2) {
    errors.push({
      msg: 'Por favor ingrese todos los campos.'
    });
  }
  //Verifica que las contraseñas coincidan.
  if (password != password2) {
    errors.push({
      msg: 'La contraseñas no coinciden.'
    });
  }
  //Verifica que las contraseñas sean mayores a los 6 caracteres.
  if (password.length < 6) {
    errors.push({
      msg: 'La contraseña debe tener al menos 6 caracteres.'
    });
  }
  //Si hubo errores renderiza "register" con los errores.
  if (errors.length > 0) {
    res.render('register', {
      errors,
      username,
      name,
      email,
      password,
      password2
    });
  } 
  //Si no hubo errores busca en la base de datos el nombre de usuario.
    else {
    User.findOne({
      username: username
    }).then(user => {
      if (user) { //Si existe el usuario, renderiza "register" con el error.
        errors.push({
          msg: 'El usuario ya existe.'
        });
        res.render('register', {
          errors,
          username,
          name,
          email,
          password,
          password2
        });
      } else { //Busca si existe el correo
        User.findOne({
          email: email
        }).then(user => {
          if (user) { //Si existe el correo, renderiza "register" con el error.
            errors.push({
              msg: 'El correo ya existe.'
            });
            res.render('register', {
              errors,
              username,
              name,
              email,
              password,
              password2
            });
          } else { // Si no hubo errores crea un nuevo usuario.
            const newUser = new User({
              username,
              name,
              email,
              password
            });
            //Genera un "hash" de la contraseña.
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save() //Guarda los datos del usuario en la base de datos.
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'Ya estas registrado, ahora puedes loguearte.'
                    );
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
      }
    });
  }
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Cerraste sesión.');
  res.redirect('/users/login');
});


module.exports = router;