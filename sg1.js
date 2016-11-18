// Определение размеров окна
var doc_w = $(window).width();
var doc_h = $(window).height();
// Скорость истребителя
let e_int_speed = 2;

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
    // Определение позиции вражеских объектов
    if($('.obj1').is('div')) {
    var marh = getHorPosition('.obj1');
    var marv = getVertPosition('.obj1');
    // Правая часть экрана
    if(marh > (doc_w-100)) {
        e_int_speed = -2;
    }
    // Левая часть экрана
    if(marh < 0) {
        e_int_speed = 2;
    }
    $('.obj1').css("margin-left", (marh + e_int_speed) + "px");
    }
    // Движение лазера
    if($('.laser').is('div')) {
        var mar1h = getHorPosition('.laser')
        var mar1v = getVertPosition('.laser')
        $('.laser').css("margin-top", (mar1v - 18) + "px");
        // Вычисление вектора до цели
        let shDist = Math.sqrt(Math.pow((marh-mar1h),2) + Math.pow((marv-mar1v),2));
        // Попадание
        if(shDist < 50) {
            $('.obj1').remove();
            $('.laser').remove();
        }
        // Промах (уход за экран)
        if(mar1v < -40) $('.laser').remove();
    }
}


$(document).ready(function()
{
    // Управление
    $(window).keydown(function(event) {
        switch (event.keyCode) {
            case 37 : move(-5); break; // Влево
            case 39 : move(5); break; // Вправо
            case 17 : if(!$('.laser').is('div')) { // Атака
                        attack(); break;
                      }
            case 27 : break; // Меню
        }
    });
    
    // Создание объектов
    // Игрок
    $("body").append("<div id='player'><img src='images/s_int1.png' width='100px'></div>");
    $("body").append("<div class='obj1'><img src='images/s_int2.png' width='100px'></div>");
    $('.obj1').css({"width" : "50px", "height" : "60px", "margin-left" : "40px", "margin-top" : "60px", position: "absolute", transform: "rotate(180deg)"});
    
    setInterval('floatObj();', 50);
});

