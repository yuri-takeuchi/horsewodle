var moji = ' ';
document.getElementById("moji_btn").onclick = function() {

    moji = document.getElementById("moji_btn").value;
    window.sessionStorage.setItem('moji', moji);
}