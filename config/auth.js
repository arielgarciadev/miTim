module.exports = {
  // AUTORIZACIONES
  // Función middleware para dejar pasar solo si el usuario esta logueado.
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Ingrese a su cuenta para ver el contenido.');
    res.redirect('/users/login');
  },
  // Función middleware para dejar pasar si el usuario no esta logueado.
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/home');   //Redirige "/home" cuando estas logueado.   
  }
};
