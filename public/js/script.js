$("#juegan").text($(".yes").length);

$("#noJuegan").text($(".no").length);

$(document).ready(function(){
    if($('#botonCalificar')[0]){
    if(Number($("#juegan")[0].textContent) < 2) {
    $('#botonCalificar').attr("disabled", "disabled");
    $('#botonCalificar').text("Deben ser al menos 2 jugadores")
    }
}
});
