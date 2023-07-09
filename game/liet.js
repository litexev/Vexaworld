export class Liet{
    new(propObj) {
        // {type, class, id, value, parent}
        let n = document.createElement(propObj.type);
        if (propObj.class != null) {
            n.classList = propObj.class;
        }
        if (propObj.id != null) {
            n.id = propObj.id;
        }
        if (propObj.value != null) {
            n.innerText = propObj.value;
        }
        if (propObj.parent != null) {
            propObj.parent.appendChild(n)
        }
        return n;
    }
    get(querySelector){
        return document.querySelector(querySelector)
    }
    getAll(querySelector){
        return document.querySelectorAll(querySelector)
    }
}