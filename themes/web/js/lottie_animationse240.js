
/*B Animations*/
function loadBMAnimation_b_animation(loader_b) {
    var animation = bodymovin.loadAnimation({
        container: loader_b,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: themePath + 'js/lib/lottie/loop-b.json'
//        path: themePath + "caca.json"
    });
}
var loader_b = document.getElementsByClassName('b_animations');
for (var i = 0; i < loader_b.length; i++) {
    loadBMAnimation_b_animation(loader_b[i]);
}