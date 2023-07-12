import { Liet } from './liet.js';

export class Window{
    constructor(uiElem){
        this.liet = new Liet();
        this.mainWindow = null;
        this.isDragging = false;
        this.prevDragX = 0;
        this.prevDragY = 0;
        // this.createUI(uiElem, "test window", "img/test.png", 400, 450);
    }
    createUI(uiElem, windowTitle, windowIcon, width, height){
        this.mainWindow = this.liet.new({type: "div", class: "v-box border-box bg-3 mainWindow", parent: uiElem});
        // hide all windows by default unless they're shown
        this.mainWindow.style.display = "none";
        this.mainWindow.style.pointerEvents = "auto";
        this.mainWindow.style.width = width + 'px';
        this.mainWindow.style.height = height + 'px';
        this.mainWindow.style.position = 'absolute';
        // @TODO: center the window or something similar
        this.titleBar = this.liet.new({type: "div", class: "h-box bg-4 gap-2 h-stretch titleBar h-center", parent: this.mainWindow});
        this.titleBar.style.userSelect = "none";
        this.titleImg = this.liet.new({type: "img", class: "titleImg", parent: this.titleBar});
        this.titleImg.src = windowIcon;
        this.titleText = this.liet.new({type: "div", class: "titleText", value: windowTitle, parent: this.titleBar});
        this.titleStretch = this.liet.new({type: "div", class: "stretch", parent: this.titleBar});
        this.titleCloseBtn = this.liet.new({type: "button", class: "titleCloseBtn", parent: this.titleBar, value: "X"});
        this.windowContent = this.liet.new({type: "div", class: "v-box stretch bg-0 pad-2 gap-3", parent: this.mainWindow});
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
        window.addEventListener('mousemove', (e) => {
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
        // close button
        this.titleCloseBtn.addEventListener('click', () => {
            this.hide();
        })
    }
    show(){
        this.mainWindow.style.display = "flex";
    }
    hide(){
        this.mainWindow.style.display = "none";
    }
}