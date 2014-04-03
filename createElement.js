//$(html, attrs).appendTo方式
function a(){
    $("<div />", {class:"xl", id:"J_test_a", "data-xl":"1"}).html("测试").appendTo(document.body);
}

//$(html).appendTo
function b(){
    $('<div class="xl" id="J_test_b" data-xl="2">测试</div>').appendTo(document.body);
}

//$(body).append
function c(){
    $(document.body).append($('<div class="xl" id="J_test_c" data-xl="3">测试</div>'));
}

//$连写
function d(){
    $("<div />").addClass("xl").attr({id:"J_test_d", "data-xl": 4}).html("测试").appendTo(document.body);
}

//dom
function e(){
    var div = document.createElement("div");
    div.className = "xl";
    div.id = "J_test_e";
    div.setAttribute("data-xl", 4);
    div.innerHTML = '测试';
    document.body.appendChild(div);
    div = null;
}

var i = 0,
    len = 10000;

console.time("a");
for(i=0;i<len;i++){
    a();
}
console.timeEnd("a");
$(".xl").remove();



console.time("b");
for(i=0;i<len;i++){
    b();
}
console.timeEnd("b");
$(".xl").remove();



console.time("c");
for(i=0;i<len;i++){
    c();
}
console.timeEnd("c");
$(".xl").remove();



console.time("d");
for(i=0;i<len;i++){
    d();
}
console.timeEnd("d");
$(".xl").remove();


console.time("e");
for(i=0;i<len;i++){
    e();
}
console.timeEnd("e");
$(".xl").remove();