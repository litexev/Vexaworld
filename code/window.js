import { Liet } from './liet.js';

export class Window{
    constructor(uiElem){
        this.liet = new Liet();
        this.mainWindow = null;
        this.isDragging = false;
        this.prevDragX = 0;
        this.prevDragY = 0;
        this.createUI(uiElem, "test window");
    }
    createUI(uiElem, windowTitle){
        this.mainWindow = this.liet.new({type: "div", class: "v-box border-box bg-3 mainWindow", parent: uiElem});
        this.mainWindow.style.width = '270px';
        this.mainWindow.style.height = '270px';
        this.mainWindow.style.position = 'absolute';
        this.titleBar = this.liet.new({type: "div", class: "h-box bg-4 h-stretch titleBar h-center", parent: this.mainWindow});
        this.titleBar.style.userSelect = "none";
        this.titleText = this.liet.new({type: "div", class: "titleText", value: windowTitle, parent: this.titleBar});
        this.titleStretch = this.liet.new({type: "div", class: "stretch", parent: this.titleBar});
        this.titleCloseBtn = this.liet.new({type: "button", class: "titleCloseBtn", parent: this.titleBar, value: "X"});
        this.windowContent = this.liet.new({type: "div", class: "v-box stretch bg-0 pad-2", parent: this.mainWindow});
        // drag code
        this.titleBar.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.prevDragX = e.clientX;
            this.prevDragY = e.clientY;
        })
        this.mainWindow.addEventListener('mouseup', () => {
            if(this.isDragging) this.isDragging = false;
        })
        this.mainWindow.addEventListener('mousemove', (e) => {
            e.preventDefault();
            if(this.isDragging){
                let newX = this.prevDragX - e.clientX;
                let newY = this.prevDragY - e.clientY;
                this.prevDragX = e.clientX;
                this.prevDragY = e.clientY;
                this.mainWindow.style.left = (this.mainWindow.offsetLeft - newX) + 'px';
                this.mainWindow.style.top = (this.mainWindow.offsetTop - newY) + 'px';
            }
        })
    }
}