import { Liet } from "./liet.js";
export class PlacerHud {
    constructor() {
        this.liet = new Liet();
    }
    createUI(uiElem){
        this.mainBox = this.liet.new({
            type: "div",
            class: "pad-2 h-box gap-4 placerHud",
            parent: uiElem
        })
        this.mainBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

        this.blockImg = this.liet.new({
            type: "img",
            class: "blockImg",
            parent: this.mainBox
        })
        this.blockImg.width = 48;
        this.blockImg.height = 48;
        this.blockImg.src = "/img/block.png"

        this.infoLayout = this.liet.new({
            type: "div",
            class: "v-box gap-3 infoLayout",
            parent: this.mainBox
        })

        this.headerText = this.liet.new({
            type: "span",
            class: "headerText",
            parent: this.infoLayout
        })
        this.headerText.innerText = "yay";

        this.bottomText = this.liet.new({
            type: "span",
            class: "bottomText",
            parent: this.infoLayout
        })
        this.bottomText.innerText = `Hold R to rotate, T to reset rotation;
        ESC to cancel, CTRL to destroy.`
    }
    setContent(blockImg, blockName, blockType){
        this.blockImg.src = blockImg;
        this.headerText.innerText = `Placing ${blockName} (${blockType})`;
    }
}