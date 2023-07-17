import { Liet } from "./liet.js";
import { PlacerHud } from "./placerHud.js";
import { TaskBar } from "./taskBar.js";
export class Hud {
    constructor(uiElem) {
        this.liet = new Liet();
        this.placerHud = new PlacerHud(uiElem);
        this.taskBar = new TaskBar(uiElem);
    }
    createUI(uiElem){
        this.hud = this.liet.new({
            type: "div",
            class: "hud v-box stretch",
            parent: uiElem
        })
        this.topLayout = this.liet.new({
            type: "div",
            class: "h-box gap-2 hudTop",
            parent: this.hud
        })
        this.placerHud.createUI(this.topLayout);
        
        this.hudStretch = this.liet.new({
            type: "div",
            class: "stretch",
            parent: this.hud
        })
        this.taskBar.createUI(this.hud);
        
    }
}