import { ScrollMagic } from "../../libs/ScrollMagic";

var welcomeImage: HTMLElement = <HTMLElement>document.querySelector("#welcome-section .cover");
var welcomeHeader: HTMLElement = <HTMLElement>document.querySelector("#welcome-section .welcome-header"); 

let controller: any = new ScrollMagic.Controller();
let scene: any = new ScrollMagic.Scene({
    triggerElement: "#welcome-section .welcome-image", 
    loglevel: 3, duration: welcomeHeader.getBoundingClientRect().top});

scene.addTo(controller)
scene.on("progress", function (e: any) {
    welcomeImage.style.filter = `blur(${5 * e.progress}px)`;
});

export function Init() {
    console.log(welcomeHeader.getBoundingClientRect().top);
}