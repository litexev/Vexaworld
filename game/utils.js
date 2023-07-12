export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
export function mod(n, m) {
    return ((n % m) + m) % m;
}

export function rndInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function snapToGrid(number, step){
    return Math.round(number / step) * step
}
export function colorToRGBA( color ) {
    if( color[0]=="#" ) { // hex notation
        color = color.replace( "#", "" ) ;
        var bigint = parseInt(color, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;
        return {r:r,
                g:g,
                b:b,
                a:255} ;
    } else if( color.indexOf("rgba(")==0 ) { // already in rgba notation
        color = color.replace( "rgba(", "" ).replace( " ", "" ).replace( ")", "" ).split( "," ) ;
        return {r:color[0],
                g:color[1],
                b:color[2],
                a:color[3]*255} ;
    } else {
        console.error( "warning: can't convert color to rgba: " + color ) ;
        return false;
    }
}