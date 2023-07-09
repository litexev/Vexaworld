export class KeyHandler {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === "ControlLeft" || e.code === "AltLeft" || e.code === "ShiftLeft") {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        window.addEventListener('blur', () => {
            this.resetKeys();
        });

        window.addEventListener('focus', () => {
            this.resetKeys();
        });
    }

    resetKeys() {
        for (const key in this.keys) {
            this.keys[key] = false;
        }
    }


    isPressed(keyCode) {
        return this.keys[keyCode] || false;
    }
}
