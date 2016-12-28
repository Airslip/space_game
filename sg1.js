// Определение размеров окна
var doc_w = $(window).width();
var doc_h = $(window).height();
var mb_w = doc_w/2 - 100;
var mb_h = doc_h/2 - 25;
var player_hp = 100;
// Скорость истребителя
var e_int_speed = 2;
// Количество врагов
var enemy_count = 0;
var game_launch = false;
$game_ended = true;

function getHorPosition(name) {
    let pos = Number($(name).css("margin-left").substring(0, $(name).css("margin-left").length - 2));
    return pos;
}

function getVertPosition(name) {
    let pos = Number($(name).css("margin-top").substring(0, $(name).css("margin-top").length - 2));
    return pos;
}

function move(speed) {
    // Движение
    let mar = getHorPosition('#player');
    $('#player').css("margin-left", (mar + speed) + "px");
    if(mar < 0) $('#player').css("margin-left", "0px"); // Ограничение слева
    if(mar > doc_w-110) $('#player').css("margin-left", (doc_w-112)); // Ограничение справа
}

function attack() {
    let mar = getHorPosition('#player');
    $('#player').before("<div class='laser'></div>");
    $('.laser').css({"margin-left" : (mar+48)+"px", "margin-top" : "500px"});
}

function floatObj() {
    if(game_launch) {
        // Определение позиции вражеских объектов
        if($('.laser').is('div')) {
            var mar1h = getHorPosition('.laser')
            var mar1v = getVertPosition('.laser')
            $('.laser').css("margin-top", (mar1v - 18) + "px");
        }
        for(var i = 0; i < enemy_count; i++) {
            if($('.obj'+i).is('div')) {
            var marh = getHorPosition('.obj'+i);
            var marv = getVertPosition('.obj'+i);
            // Правая часть экрана
            if(marh > (doc_w-100)) {
                e_int_speed = -2;
            }
            // Левая часть экрана
            if(marh < 0) {
                e_int_speed = 2;
            }
            $('.obj'+i).css("margin-left", (marh + e_int_speed) + "px");
            }
            // Движение лазера
            if($('.laser').is('div')) {
                // Вычисление вектора до цели
                let shDist = Math.sqrt(Math.pow((marh-mar1h),2) + Math.pow((marv-mar1v),2));
                // Попадание
                if(shDist < 50 && $('.obj'+i).is('div')) {
                    $('.obj'+i).remove();
                    $('.laser').remove();
                }
                // Промах (уход за экран)
                if(mar1v < -40) $('.laser').remove();
            }
            // Лазер врагов
            if($('.e_laser'+i).is('div')) {
                var e_mar1h = getHorPosition('.e_laser'+i)
                var e_mar1v = getVertPosition('.e_laser'+i)
                $('.e_laser'+i).css("margin-top", (e_mar1v + 18) + "px");
                // Вычисление вектора до цели
                var ph = getHorPosition('#player');
                var pv = getVertPosition('#player');
                let shDist = Math.sqrt(Math.pow((ph+50-e_mar1h),2) + Math.pow((pv-e_mar1v),2));
                // Попадание
                if(shDist < 50) {
                    player_hp = player_hp - 20;
                    $('#player_hp').css({"width" : (player_hp)+"px"});
                    $('.e_laser'+i).remove();
                }
                 // Промах (уход за экран)
                 if(e_mar1v > doc_h-50) $('.e_laser'+i).remove();
            }
        }
    }
}

function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function events() {
    if(game_launch) {
        // Вражеские атаки
        for(var i = 0; i < enemy_count; i++) {
            let q = getRandomInt(0, 1000);
            if(q > 800) {
                let mar = getHorPosition('.obj'+i);
                $('.obj'+i).before("<div class='red_laser e_laser"+i+"'></div>");
                $('.e_laser'+i).css({"margin-left" : (mar+48)+"px", "margin-top" : "50px"});
            }
        }
        // Победа
        if($('#playground .enemy').length == 0) {
            game_launch = 0;
            $('#playground').append("<div id='message' style='top: "+mb_h+"px; left: "+mb_w+"px; background: blue;'>УРОВЕНЬ ПРОЙДЕН</div>");
            $("#message").fadeIn(1000);
            $game_ended = true;
        }
        // Поражение
        if(player_hp <= 0) {
            $('#player').remove();
            game_launch = 0;
            $('#playground').append("<div id='message' style='top: "+mb_h+"px; left: "+mb_w+"px; background: red;'>ПОРАЖЕНИЕ</div>");
            $("#message").fadeIn(1000);
            $game_ended = true;
        }
    }
}

// Уровни
function round_1() {
    // Создание объектов
    // Игрок
    $('#playground').append("<div id='player'><img src='images/s_int1.png' width='100px'></div>");
    $('#player').css({"margin-top" : (doc_h-120)+"px"});
    // Враги
    enemy_count = 3;
    let pw = 0
    for(var i = 0; i < enemy_count; i++) {
        $('#playground').append("<div class='enemy obj"+i+"'><img src='images/s_int2.png' width='80px'></div>");
        $('.obj'+i).css({"width" : "50px", "height" : "60px", "margin-left" : (40+pw)+"px", "margin-top" : "60px", position: "absolute", transform: "rotate(180deg)"});
        pw=pw+100;
    }
    // Интерфейс
    $('#playground').append("<div id='player_hp_border'></div>");
    $('#player_hp_border').css({"margin-left" : "40px", "margin-top" : (doc_h-30)+"px"});
    $("#player_hp_border").append("<div id='player_hp'></div>");
}

$(document).ready(function()
{
    // Управление
    $(window).keydown(function(event) {
        switch (event.keyCode) {
            case 37 : if(game_launch) {move(-5); break;} // Влево
            case 39 : if(game_launch) {move(5); break;} // Вправо
            case 17 : if(!$('.laser').is('div') && game_launch) { // Атака
                        attack();
                      }
                      break;
            case 27 : // --------------Меню--------------------
                      if($('.menu_window').is(':visible')) {
                        if(!$game_ended) game_launch = true;
                        $('.fon_black').hide();
                        $('.menu_window').hide();
                      } else {
                        game_launch = false;
                        $('.fon_black').show();
                        $('.menu_window').show();
                      }
                      break;
        }
    });
    
    // Меню
    // Новая игра
    $('#new_game').click(function() {
        $('#playground').empty();
        player_hp = 100;
        round_1();
        $('.fon_black').hide();
        $('.menu_window').hide();
        game_launch = true;
        $game_ended = false;
    });
    
        setInterval('floatObj();', 50);
        setInterval('events();', 1000);
});

