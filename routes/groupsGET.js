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

// Página del grupo
router.get('/editGroups/:idGroup/', ensureAuthenticated, (req, res) => {


  //Busca usuarios asociados al grupo.
  Group.findById(req.params.idGroup, function (err, result) {
    if (err) throw err;
    //Resultados.


    console.log(result);
    res.render('editGroup', {
      user: req.user,
      grupo: result,
    })
  })



});


//Página de información del grupo
router.get('/infoGroup/:idGroup/', ensureAuthenticated, (req, res) => {
  //Busca usuarios asociados al grupo.
  Group.findById(req.params.idGroup, function (err, result) {
    if (err) throw err;
    //Resultados.
    console.log(result);
    res.render('infoGroup', {
      user: req.user,
      grupo: result,
    })
  })

})

// Página del grupo
router.get('/groups/:idGroup', ensureAuthenticated, async (req, res, next) => {
  (async () => {
    try {
      let arrayDatosdeUsuario = [];
      let group = await Group.findById(req.params.idGroup)

      User.findById(req.user.id, function (err, result) {
        if (err) throw err;
        console.log(result)
        console.log("result.lastGroup es" + result.lastGroup)
        console.log("req.params.idGroup es" + req.params.idGroup)
        result.lastGroup = req.params.idGroup;
        result.save(console.log("last Group es " + result.lastGroup))
      })

      for (let i = 0; i < group.users.length; i++) {
        let usersdelgrupo = await User.findOne({
          _id: group.users[i].userID
        })
        arrayDatosdeUsuario.push({
          name: usersdelgrupo.name,
          image: usersdelgrupo.userImage,
          score: usersdelgrupo.score,
        });

      }

      let groupRater = await Group.findOne({
        '_id': req.params.idGroup,
        "raters": {
          $in: req.user.id
        }
      }).then(repetido => {
        console.log("resultado de repetido, abajo")
        console.log(repetido)
        if (repetido) {
          console.log("repetidoexiste")
          return "Existe"
        } else if (!repetido) {
          console.log("repetidoNOexiste")
          return "no Existe"
        };
      })


      if (group.admin == req.user.id) {
        if (group.mode == "play") {
          console.log("OPCION 1")
          res.render('matchAdmin', {
            user: req.user,
            usuarios: arrayDatosdeUsuario,
            grupo: group,
          })
        } else if (group.mode == "calificacion") {
          if (groupRater == "Existe") {
            console.log("OPCION 2")
            res.render('matchAdmin', {
              user: req.user,
              usuarios: arrayDatosdeUsuario,
              grupo: group,
            })
          } else if (groupRater == "no Existe") {
            console.log("OPCION 3")
            res.render('reviewAdmin', {
              user: req.user,
              usuarios: arrayDatosdeUsuario,
              grupo: group,
            })
          }
        }
      } else if (group.admin != req.user.id) {
        if (group.mode == "play") {
          console.log("OPCION 4")
          res.render('match', {
            user: req.user,
            usuarios: arrayDatosdeUsuario,
            grupo: group,
          })
        } else if (group.mode == "calificacion") {
          if (groupRater == "no Existe") {
            console.log("OPCION 5")
            res.render('review', {
              user: req.user,
              usuarios: arrayDatosdeUsuario,
              grupo: group,
            })
          } else if (groupRater == "Existe") {
            console.log("OPCION 6")
            res.render('match', {
              user: req.user,
              usuarios: arrayDatosdeUsuario,
              grupo: group,
            })
          }
        }
      }
    } catch (e) {
      res.render('home')
    }
  })()

})

// Página del grupo (AGREGUE CORCHETES)
router.get('/addUser/:idGroup', ensureAuthenticated, (req, res) => {

  //Busca usuarios asociados al grupo.
  Group.findById(req.params.idGroup, function (err, result) {
    if (err) throw err;
    //Resultados.
    console.log(result);
    res.render('addUser', {
      user: req.user,
      grupo: result,
    })
  })
});

module.exports = router;