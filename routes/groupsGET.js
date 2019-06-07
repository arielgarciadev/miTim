const express = require('express');
const router = express.Router();
var path = require('path');
var mongoose = require('mongoose');

const {
  ensureAuthenticated,
} = require('../config/auth');

// Cárga modelos
var User = mongoose.model('User');
const Group = require('../models/Group');

// Página para creacion de grupos.
router.get('/createGroup', ensureAuthenticated, (req, res) => res.render('createGroup', {
  user: req.user,
}));

// Página de edición de perfil.
router.get('/editProfile', ensureAuthenticated, (req, res) => res.render('editProfile', {
  user: req.user,
}));

// Página de edición del grupo.
router.get('/editGroups/:idGroup/', ensureAuthenticated, (req, res) => {

  //Busca con la id del grupo en la colección "groups".
  Group.findById(req.params.idGroup, function (err, result) {

    if (err) throw err;

    //Renderiza "editGroup" con los datos del grupo(result) y el usuario(req.user).
    res.render('editGroup', {
      user: req.user,
      grupo: result,
    })
  })
});


// Página de información del grupo
router.get('/infoGroup/:idGroup/', ensureAuthenticated, (req, res) => {

  //Busca con la id del grupo en la colección "groups".
  Group.findById(req.params.idGroup, function (err, result) {

    if (err) throw err;

    //Renderiza "infoGroup" con los datos del grupo(result) y el usuario(req.user).
    res.render('infoGroup', {
      user: req.user,
      grupo: result,
    })
  })
})

// Página del grupo
router.get('/groups/:idGroup', ensureAuthenticated, async (req, res, next) => {

  // Promesas
  (async () => {
    try {
      // Array para guardar los datos de los usaurios del grupo.
      let arrayDatosdeUsuario = [];

      // Promesa - Busca en la colección "groups" con la ID del grupo.
      let group = await Group.findById(req.params.idGroup)

      // Busca en la colección "users" por la id del usuario.
      User.findById(req.user.id, function (err, result) {

        if (err) throw err;

        // Si devuelve el resultado (result), modifica el valor de "lastGroup" del usuario por el Id del grupo actual.
        result.lastGroup = req.params.idGroup;

        //Guarda los datos y hace un console.log.
        result.save(console.log("last Group es " + result.lastGroup))
      })

      // Hace un loop igual a la cantidad de usuario en el grupo.
      for (let i = 0; i < group.users.length; i++) {

        // Promesa - Busca en la colección "users" con el valor de userID de cada usuario del grupo.
        let usersdelgrupo = await User.findOne({
          _id: group.users[i].userID
        })

        // Pushea los datos de los usuarios (name, image y score) en "arrayDatosdeUsuario".
        arrayDatosdeUsuario.push({
          name: usersdelgrupo.name,
          image: usersdelgrupo.userImage,
          score: usersdelgrupo.score,
        });

      }

      // Promesa - Busca en la colección "groups" con el ID del grupo y el ID del usuario dentro de raters. 
      let groupRater = await Group.findOne({
        '_id': req.params.idGroup,
        "raters": { // Raters son los usuarios que ya calificaron a sus compañeros.
          $in: req.user.id
        }
      }).then(repetido => {
        // Si el usuario ya esta incluido en "raters" devuelve "Existe".   
        if (repetido) {
          return "Existe"
        }
        // Si el usuario no esta incluido en "raters" devuelve "no Existe".
        else if (!repetido) {
          return "no Existe"
        };
      })

      // Si el valor de group.admin es igual a la ID del usuario. 
      if (group.admin == req.user.id) {

        // Y el modo de juego del grupo es "play".
        if (group.mode == "play") {

          //Renderiza "matchAdmin" con el valor de las variables.
          res.render('matchAdmin', {
            user: req.user,
            usuarios: arrayDatosdeUsuario,
            grupo: group,
          })
        }
        // En cambio, si el modo de juego del grupo es "calificacion".
        else if (group.mode == "calificacion") {

          // Y el ID del usuario se encuentrea en "raters" del grupo.
          if (groupRater == "Existe") {

            //Renderiza "matchAdmin" con el valor de las variables.
            res.render('matchAdmin', {
              user: req.user,
              usuarios: arrayDatosdeUsuario,
              grupo: group,
            })
          } 
          // Si el ID del usuario no se encuentrea en "raters" del grupo.
          else if (groupRater == "no Existe") {
            
            //Renderiza "reviewAdmin" con el valor de las variables.
            res.render('reviewAdmin', {
              user: req.user,
              usuarios: arrayDatosdeUsuario,
              grupo: group,
            })
          }
        }
      } 
      // Si el valor de group.admin no es igual a la ID del usuario. 
      else if (group.admin != req.user.id) {

        // Y el modo de juego del grupo es "play".
        if (group.mode == "play") {

          //Renderiza "match" con el valor de las variables.
          res.render('match', {
            user: req.user,
            usuarios: arrayDatosdeUsuario,
            grupo: group,
          })
        } 
        // En cambio, si el modo de juego del grupo es "calificacion".
        else if (group.mode == "calificacion") {

          // Y el ID del usuario no se encuentrea en "raters" del grupo.
          if (groupRater == "no Existe") {
            
            //Renderiza "review" con el valor de las variables.
            res.render('review', {
              user: req.user,
              usuarios: arrayDatosdeUsuario,
              grupo: group,
            })
          } 
          // Y el ID del usuario se encuentrea en "raters" del grupo.
          else if (groupRater == "Existe") {
            
            //Renderiza "match" con el valor de las variables.
            res.render('match', {
              user: req.user,
              usuarios: arrayDatosdeUsuario,
              grupo: group,
            })
          }
        }
      }
    } catch (e) { 
      // Si hay un error renderiza "home"
      res.render('home') 
    }
  })()

})

// Página para agregar usuarios al grupo 
router.get('/addUser/:idGroup', ensureAuthenticated, (req, res) => {

  //Busca en la colección "groups" con la id del grupo.
  Group.findById(req.params.idGroup, function (err, result) {

    if (err) throw err;

    //Renderiza "addUsers" con los datos de las variables (result, req.user).
    res.render('addUser', {
      user: req.user,
      grupo: result,
    })
  })
});

module.exports = router;