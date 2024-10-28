import { init } from "./game/Game";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const spritesheet = document.getElementById('spritesheet');

const menu = document.querySelector(".menu");
const score = document.querySelector(".score")
const btnMenu = document.querySelector(".play-game")

const font = window.getComputedStyle(document.body).fontFamily;
const fontWeith = window.getComputedStyle(document.body).fontWeight;

canvas.width  = 900;
canvas.height = 600;

btnMenu.addEventListener( "click",()=>{
    init();
})
