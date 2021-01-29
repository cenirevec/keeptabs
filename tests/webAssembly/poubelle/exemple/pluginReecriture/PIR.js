/*
Just draw a border round the document.body.
*/
//document.body.style.border = "5px solid red";


var std ={
    "sendBttnSelector" : "div.notranslate span"
}

var importedFunction = {
    "encrypt" : Module.cwrap('encrypt', 'string', ['string', 'string']),
    "decrypt" : Module.cwrap('decrypt', 'string', ['string', 'string'])
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

/* Encrypt the text */

function encrypt(bouton){
    console.log("encrypting");

    let source = document.querySelector("#msg");

    let newText = importedFunction.encrypt("17",source.value);
    
    source.style.opacity = 0;
    source.value = newText;
    bouton.click();
}

function decrypt(event,secondFunction){
    console.log("decrypting");


}

function adapt(){
    console.log("adapting the page");
    let liste = document.querySelectorAll(std.sendBttnSelector);
    
    liste.forEach(bouton => {
        /*
        let div = document.createElement("div");
        div.style.width = bouton.offsetWidth+"px";
        div.style.height = bouton.offsetHeight+"px";

        div.style.left = getOffset(bouton).left +"px";
        div.style.top = getOffset(bouton).top +"px";

        //div.style.border = "2px solid red";
        div.style.display = "inline-block";
        div.style.position = "absolute";
        div.style.cursor = "pointer";
       // console.log(bouton);
        div.addEventListener("click",function(){encrypt(bouton);
             console.log(bouton);});

        bouton.parentNode.appendChild(div);*/
        bouton.style.border = "2px solid black";
        
    });
   
}

// Facebook
function detectTextBars(){

}

console.log(std.sendBttnSelector);
adapt();
detectTextBars();

//window.setTimeout(adapt,5000);
/*
window.onload(function(){
    alert("OK");
});*/

//window.addEventListener("load",function(){alert("ok")});

window.onload = "alert('ok')";


array.forEach(element => {
    
});