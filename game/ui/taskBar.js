import { Liet } from "./liet.js";
import { PixelDrawer } from "./pixelDrawer.js";

export class TaskBar {
    constructor(uiElem) {
        this.liet = new Liet();
        this.pixelDrawer = new PixelDrawer(uiElem);
        this.mainBox = null;
    }
    createUI(uiElem){
        this.mainBox = this.liet.new({
            type: "div",
            class: "h-box gap-2 taskBar",
            parent: uiElem
        })
        this.mainBox.style.pointerEvents = "auto";
        this.mainBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

        this.pixelDrawerBtn = this.createButton("/img/icon/painter.png", this.pixelDrawer)
    }
    createButton(imgUrl, windowInstance){
        let newBtn = this.liet.new({
            type: "div",
            class: "pad-1 taskBarBtn",
            parent: this.mainBox
        })
        newBtn.addEventListener('click', () => {
            console.log("we got click")
            windowInstance.show();
        })
        let btnImg = this.liet.new({
            type: "img",
            class: "taskBarBtnImg",
            parent: newBtn
        })

        btnImg.src = imgUrl
        btnImg.width = 32
        btnImg.height = 32
        return newBtn;
    }
}