//DOM是已知的

var J_top_bar = document.createElement("div");

J_top_bar.style.cssText = 'position:fixed;left:100px;top:100px;background-color:#fff;color:#000;padding:10px;border:2px solid #09f;';

document.body.appendChild(J_top_bar);

J_top_bar.setAttribute("data-xl", 1);

J_top_bar.innerHTML = '1';


//js
function a (argument) {
    //不用模拟, 困为
    var that = this;
    if(!that._mark){
        that._mark = 1;
        //操作dom
        that.innerHTML = that.innerHTML * 1 + 1;

        that.setAttribute("xl", that.getAttribute("xl") * 1 + 1);
    }

    delete that._mark;//去掉标识
}


//$
function b (argument) {

    //模拟每一次的点击, 因为 点击里面要用 $this  = this;
    var $this = jQuery(this);
    if(!$this.data("mark")){
        $this.data("mark");

        //操作dom
        $this.html(function(i, val){
            return val * 1 + 1;
        }).attr("data-xl", $this.attr("data-xl") * 1 + 1);

    }

    $this.data("mark", 0);//去掉标识

}
var start = new Date - 0;

// console.time("dom");
for(var i = 0;i<10000;i++){
    a.call(J_top_bar);
}
// console.timeEnd("dom");
alert("dom : "+ ((new Date - 0) - start))

start = new Date - 0;

// console.time("$");
for(var i = 0;i<10000;i++){
    b.call(J_top_bar);
}
// console.timeEnd("$");
alert("$ : "+ ((new Date - 0) - start))