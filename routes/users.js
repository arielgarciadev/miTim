const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Cárga modelos
const Group = require('../models/Group');
const User = require('../models/User');

const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

// Página de logueo.
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Página de registro.
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Registro(POST)
router.post('/register', (req, res) => {
  const {
    username,
    name,
    email,
    password,
    password2
  } = req.body;
  let errors = [];

  //Validaciones
  if (!username || !name || !email || !password || !password2) {
    errors.push({
      msg: 'Por favor ingrese todos los campos.'
    });
  }

  if (password != password2) {
    errors.push({
      msg: 'La contraseñas no coinciden.'
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'La contraseña debe tener al menos 6 caracteres.'
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      username,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({
      username: username
    }).then(user => {
      if (user) {
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
      } else {
        User.findOne({
          email: email
        }).then(user => {
          if (user) {
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
          } else {
            const newUser = new User({
              username,
              name,
              email,
              password
            });

            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
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

// Crear Grupos
router.post('/profile', (req, res) => {
  const {
    name,
  } = req.body;
  let errors = [];

  if (!name) {
    errors.push({
      msg: 'Ingrese el nombre del grupo.'
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
          res.redirect('/profile');
        } else {
          const newGroup = new Group({
            name,
          });
          newGroup.save()
            .then(group => {
              req.flash(
                'success_msg',
                'Creaste el grupo.'
              );
              res.redirect('/profile');
            });
          newGroup.users.push({
            'userID': req.user.id,
            'username': req.user.username,
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

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/profile',
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