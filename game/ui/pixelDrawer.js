import { Liet } from './liet.js';
import { Window } from './window.js'

export class PixelDrawer extends Window{
    constructor(uiElem){
        super(uiElem);
        this.blockTypes = {
            "solid": {width: 48, height: 48, states: ["default"]},
            "pusher": {width: 48, height: 48, states: ["right", "left", "up", "down"]},
        }

        this.createUI(uiElem, "Pixel Drawer", "img/test.png", 400, 450);
        this.topLayout = this.liet.new({type: "div", class: "h-box gap-2 topLayout", parent: this.windowContent});

        this.typeLabel = this.liet.new({type: "span", class: "typeLabel", value: "Block Type:", parent: this.topLayout});
        this.typeSelect = this.liet.new({type: "select", class: "typeSelect", parent: this.topLayout});
        for(let type in this.blockTypes){
            this.liet.new({type: "option", value: type, parent: this.typeSelect});
        }

        this.topStretch = this.liet.new({type: "div", class: "stretch", parent: this.topLayout});

        this.stateLabel = this.liet.new({type: "span", class: "stateLabel", value: "State:", parent: this.topLayout});
        this.stateSelect = this.liet.new({type: "select", class: "stateSelect", parent: this.topLayout});

        this.canvas = this.liet.new({type: "canvas", class: "canvas bg-2", parent: this.windowContent});
    }
}