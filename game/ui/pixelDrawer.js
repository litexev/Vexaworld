import { snapToGrid, mod, colorToRGBA } from '../utils.js';
import { Liet } from './liet.js';
import { Window } from './window.js'
import { KeyHandler } from '../keyHandler.js';
export class PixelDrawer extends Window{
    pixelX = 0;
    pixelY = 0;
    mouseDown = false;
    constructor(uiElem){
        super(uiElem);

        this.pixelScale = 8;
        this.penSize = 2;
        this.color = "black";
        // this.palette = ["#472d3c", "#5e3643", "#7a444a", "#a05b53", "#bf7958", "#eea160", "#f4cca1", "#b6d53c", "#71aa34", "#397b44", "#3c5956", "#302c2e", "#5a5353", "#7d7071", "#a0938e", "#cfc6b8", "#dff6f5", "#8aebf1", "#28ccdf", "#3978a8", "#394778", "#39314b", "#564064", "#8e478c", "#cd6093", "#ffaeb6", "#f4b41b", "#f47e1b", "#e6482e", "#a93b3b", "#827094", "#4f546b"]
        this.palette = ["#060608", "#141013", "#3b1725", "#73172d", "#b4202a", "#df3e23", "#fa6a0a", "#f9a31b", "#ffd541", "#fffc40", "#d6f264", "#9cdb43", "#59c135", "#14a02e", "#1a7a3e", "#24523b", "#122020", "#143464", "#285cc4", "#249fde", "#20d6c7", "#a6fcdb", "#ffffff", "#fef3c0", "#fad6b8", "#f5a097", "#e86a73", "#bc4a9b", "#793a80", "#403353", "#242234", "#221c1a", "#322b28", "#71413b", "#bb7547", "#dba463", "#f4d29c", "#dae0ea", "#b3b9d1", "#8b93af", "#6d758d", "#4a5462", "#333941", "#422433", "#5b3138", "#8e5252", "#ba756a", "#e9b5a3", "#e3e6ff", "#b9bffb", "#849be4", "#588dbe", "#477d85", "#23674e", "#328464", "#5daf8d", "#92dcba", "#cdf7e2", "#e4d2aa", "#c7b08b", "#a08662", "#796755", "#5a4e44", "#423934"]
        this.paletteIndex = 0;
        this.color = this.palette[0];
        this.blockTypes = {
            "solid": {width: 48, height: 48, states: ["default"]},
            "pusher": {width: 48, height: 48, states: ["right", "left", "up", "down"]},
        }
        this.undoStorage = [];
        this.keyHandler = new KeyHandler(this);
        this.createUI(uiElem);
        this.setupEventListeners();
    }
    createUI(uiElem){
        super.createUI(uiElem, "Pixel Drawer", "img/test.png", 450, 670);
        this.topLayout = this.liet.new({type: "div", class: "h-box gap-2 topLayout", parent: this.windowContent});

        this.typeLabel = this.liet.new({type: "span", class: "typeLabel", value: "Block Type:", parent: this.topLayout});
        this.typeSelect = this.liet.new({type: "select", class: "typeSelect", parent: this.topLayout});
        for(let type in this.blockTypes){
            this.liet.new({type: "option", value: type, parent: this.typeSelect});
        }

        this.topStretch = this.liet.new({type: "div", class: "stretch", parent: this.topLayout});

        this.stateLabel = this.liet.new({type: "span", class: "stateLabel", value: "State:", parent: this.topLayout});
        this.stateSelect = this.liet.new({type: "select", class: "stateSelect", parent: this.topLayout});

        this.smallCanvasLayout = this.liet.new({type: "div", class: "v-box center smallCanvasLayout", parent: this.windowContent});
        this.smallCanvas = this.liet.new({type: "canvas", class: "canvas bg-1", parent: this.smallCanvasLayout});
        this.smallCanvas.width = 48;
        this.smallCanvas.height = 48;

        this.ctx = this.smallCanvas.getContext("2d", { willReadFrequently: true })
        this.canvasLayout = this.liet.new({type: "div", class: "v-box center canvasLayout", parent: this.windowContent});

        this.largeCanvas = this.liet.new({type: "canvas", class: "canvas border bg-6", parent: this.canvasLayout});

        this.previewCanvas = this.liet.new({type: "canvas", class: "previewCanvas", parent: this.canvasLayout});
        this.previewCanvas.style.padding = "1px";

        // overlap canvases
        this.canvasLayout.style.display = "grid";
        this.largeCanvas.style.gridArea = "1 / 1 / 2 / 2";
        this.previewCanvas.style.gridArea = "1 / 1 / 2 / 2";
        this.previewCanvas.style.pointerEvents = "none";

        this.largeCtx = this.largeCanvas.getContext('2d');
        this.preCtx = this.previewCanvas.getContext('2d');
        this.largeCanvas.width = 48*8;
        this.largeCanvas.height = 48*8;

        this.previewCanvas.width = this.largeCanvas.width;
        this.previewCanvas.height = this.largeCanvas.height;

        this.colorsLayout = this.liet.new({type: "div", class: "h-box colorsLayout wrap v-center", parent: this.windowContent});
        this.createPaletteButtons();

        this.actionsLayout = this.liet.new({type: "div", class: "h-box gap-2 actionsLayout", parent: this.windowContent});
        this.actionsStretch = this.liet.new({type: "div", class: "stretch", parent: this.actionsLayout});
        this.downloadButton = this.liet.new({type: "button", class: "downloadButton", value: "Download", parent: this.actionsLayout});
        this.downloadButton.onclick = (e) => { this.downloadImage(); }
    }
    createPaletteButtons(){
        this.palette.forEach(color => {
            let colorElem = this.liet.new({type: "div", class: "color", parent: this.colorsLayout});
            colorElem.style.width = "24px";
            colorElem.style.height = "24px";
            colorElem.style.backgroundColor = color;
            colorElem.onclick = () => {
                this.color = color
            }
        })
    }
    setupEventListeners(){
        this.windowContent.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
            this.mouseMove(e, true);
        })
        this.windowContent.addEventListener('mousemove', (e) => {
            this.mouseMove(e, false)
        })
        this.windowContent.addEventListener('mouseup', (e) => {
            this.mouseDown = false;
        })
        this.windowContent.addEventListener('mouseleave', (e) => {
            this.mouseDown = false;
            this.preCtx.clearRect(0, 0, this.largeCanvas.width, this.largeCanvas.height);
        })
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                this.loadLastState();
                e.preventDefault();
            }
        })
        
        // color cycler
        window.addEventListener('wheel', (e) => {
            if(e.deltaY > 0) this.paletteIndex += 1
            if(e.deltaY < 0) this.paletteIndex -= 1
            this.paletteIndex = mod(this.paletteIndex, this.palette.length)
            this.color = this.palette[this.paletteIndex];
            this.mouseMove(e);
        })
    }

    mouseMove(e, firstPress){
        // calculate relative mouse position
        let rect = this.largeCanvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;
        
        let pxScale = this.penSize*this.pixelScale;
        let pixelX = snapToGrid(mouseX - pxScale/2, this.penSize*this.pixelScale)/this.pixelScale;
        let pixelY = snapToGrid(mouseY - pxScale/2, this.penSize*this.pixelScale)/this.pixelScale;

        this.drawPreview(pixelX * this.pixelScale, pixelY * this.pixelScale);

        if(this.mouseDown){
            if(this.getColorAtPos(this.ctx, pixelX, pixelY) == this.color) return;
            if(firstPress && this.keyHandler.isPressed("KeyF")){
                if(colorToRGBA(this.color) == false) return;
                this.saveState();
                this.floodFill(this.smallCanvas, this.ctx, pixelX, pixelY, colorToRGBA(this.color));
                this.copyToLarge();
                return;
            }
            //this.drawPixel(this.largeCtx, pixelX, pixelY, pxScale);
            this.saveState();
            this.drawPixel(this.ctx, pixelX, pixelY, 2);
            this.copyToLarge();
        }
    }
    copyToLarge(){
        this.largeCtx.imageSmoothingEnabled = false;
        this.largeCtx.clearRect(0, 0, this.largeCanvas.width, this.largeCanvas.height);
        this.largeCtx.drawImage(this.smallCanvas, 0, 0, this.smallCanvas.width, this.smallCanvas.height, 0, 0, this.largeCanvas.width, this.largeCanvas.height);
    }

    drawGrid(){
        this.preCtx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        this.preCtx.lineWidth = 1;
        let gridScale = this.pixelScale * 2;
        for(let x = 0; x < (this.largeCanvas.width/gridScale); x++){
            if(x == 0) continue;
            this.preCtx.beginPath();
            this.preCtx.moveTo(x*gridScale+0.5, 0);
            this.preCtx.lineTo(x*gridScale+0.5, this.largeCanvas.height);
            this.preCtx.stroke();
        }
        for(let y = 0; y < (this.largeCanvas.height/gridScale); y++){
            if(y == 0) continue;
            this.preCtx.beginPath();
            this.preCtx.moveTo(0, y*gridScale+0.5);
            this.preCtx.lineTo(this.largeCanvas.width, y*gridScale+0.5);
            this.preCtx.stroke();
        }
    }

    drawPreview(x, y){
        this.preCtx.clearRect(0, 0, this.largeCanvas.width, this.largeCanvas.height);
        this.drawGrid();
        this.preCtx.strokeStyle = "white";
        this.preCtx.lineWidth = 2;
        this.preCtx.fillStyle = this.color;
        let pxScale = this.penSize*this.pixelScale;
        this.preCtx.strokeRect(x, y, pxScale, pxScale);
        this.preCtx.fillRect(x, y, pxScale, pxScale);
    }

    drawPixel(ctx, x, y, scale){
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, scale, scale);
    }

    floodFill(canvas, ctx, x, y, color ) {
        let pixel_stack = [{x:x, y:y}] ;
        let pixels = ctx.getImageData( 0, 0, canvas.width, canvas.height ) ;
        let linear_cords = ( y * canvas.width + x ) * 4 ;
        let original_color = {r:pixels.data[linear_cords],
                          g:pixels.data[linear_cords+1],
                          b:pixels.data[linear_cords+2],
                          a:pixels.data[linear_cords+3]} ;
        while( pixel_stack.length>0 ) {
            let new_pixel = pixel_stack.shift();
            let x = new_pixel.x ;
            let y = new_pixel.y ;

            //console.log( x + ", " + y ) ;
      
            linear_cords = ( y * canvas.width + x ) * 4 ;
            while( y-->=0 &&
                   (pixels.data[linear_cords]==original_color.r &&
                    pixels.data[linear_cords+1]==original_color.g &&
                    pixels.data[linear_cords+2]==original_color.b &&
                    pixels.data[linear_cords+3]==original_color.a) ) {
                linear_cords -= canvas.width * 4 ;
            }
            linear_cords += canvas.width * 4 ;
            y++ ;

            var reached_left = false ;
            var reached_right = false ;
            while( y++<canvas.height &&
                   (pixels.data[linear_cords]==original_color.r &&
                    pixels.data[linear_cords+1]==original_color.g &&
                    pixels.data[linear_cords+2]==original_color.b &&
                    pixels.data[linear_cords+3]==original_color.a) ) {
                pixels.data[linear_cords]   = color.r ;
                pixels.data[linear_cords+1] = color.g ;
                pixels.data[linear_cords+2] = color.b ;
                pixels.data[linear_cords+3] = color.a ;

                if( x>0 ) {
                    if( pixels.data[linear_cords-4]==original_color.r &&
                        pixels.data[linear_cords-4+1]==original_color.g &&
                        pixels.data[linear_cords-4+2]==original_color.b &&
                        pixels.data[linear_cords-4+3]==original_color.a ) {
                        if( !reached_left ) {
                            pixel_stack.push( {x:x-1, y:y} ) ;
                            reached_left = true ;
                        }
                    } else if( reached_left ) {
                        reached_left = false ;
                    }
                }
            
                if( x<canvas.width-1 ) {
                    if( pixels.data[linear_cords+4]==original_color.r &&
                        pixels.data[linear_cords+4+1]==original_color.g &&
                        pixels.data[linear_cords+4+2]==original_color.b &&
                        pixels.data[linear_cords+4+3]==original_color.a ) {
                        if( !reached_right ) {
                            pixel_stack.push( {x:x+1,y:y} ) ;
                            reached_right = true ;
                        }
                    } else if( reached_right ) {
                        reached_right = false ;
                    }
                }
                
                linear_cords += canvas.width * 4 ;
            }
        }
        ctx.putImageData( pixels, 0, 0 ) ;
    }

    getColorAtPos(ctx, x, y) {     
        if (x < 0 || y < 0 || x >= this.smallCanvas.width || y >= this.smallCanvas.height) {
          return false;
        }
        const pixelData = ctx.getImageData(0, 0, this.smallCanvas.width, this.smallCanvas.height);
      
        const index = (y * pixelData.width + x) * 4;
      
        const red = pixelData.data[index];
        const green = pixelData.data[index + 1];
        const blue = pixelData.data[index + 2];
      
        return this.rgbToHex(red, green, blue);
      }
      
      // @TODO: move to math utils
      rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      }

      saveState(){
        let img = new Image();
        img.width = this.smallCanvas.width;
        img.height = this.smallCanvas.height;
        img.src = this.smallCanvas.toDataURL();
        this.undoStorage.push(img);
      }
      loadLastState(){
        this.ctx.clearRect(0, 0, this.smallCanvas.width, this.smallCanvas.height);
        this.ctx.drawImage(this.undoStorage.pop(), 0, 0);
        this.copyToLarge();
      }
      downloadImage(){
        let link = document.createElement('a');
        link.download = 'img.png';
        link.href = this.smallCanvas.toDataURL()
        link.click();
      }
}