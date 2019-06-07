//Cuenta la cantidad de jugadores respondieron "Sí" y lo muestra en #juegan.
$("#juegan").text($(".yes").length);

//Cuenta la cantidad de jugadores respondieron "No" y lo muestra en #noJuegan.
$("#noJuegan").text($(".no").length);

//Deshabilita el botón para calificar si el número de jugadores es menor a 2.
$(document).ready(function(){
    if($('#botonCalificar')[0]){
    if(Number($("#juegan")[0].textContent) < 2) {
    $('#botonCalificar').attr("disabled", "disabled");
    $('#botonCalificar').text("Deben ser al menos 2 jugadores")
    }
}
});
