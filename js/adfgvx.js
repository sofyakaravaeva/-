const ADFGVX_CHARS = "ADFGVX";
const GRID = [
    ['A','B','C','D','E','F'], ['G','H','I','J','K','L'],
    ['M','N','O','P','Q','R'], ['S','T','U','V','W','X'],
    ['Y','Z','0','1','2','3'], ['4','5','6','7','8','9']
];

function substitute(text) {
    let res = "";
    for (let char of text.toUpperCase().replace(/[^A-Z0-9]/g, '')) {
        for (let r = 0; r < 6; r++) {
            let c = GRID[r].indexOf(char);
            if (c !== -1) res += ADFGVX_CHARS[r] + ADFGVX_CHARS[c];
        }
    }
    return res;
}

function columnarTransposition(text, key) {
    let sortedKey = key.split('').map((c, i) => ({c, i})).sort((a, b) => a.c.localeCompare(b.c));
    let numCols = key.length;
    let numRows = Math.ceil(text.length / numCols);
    let grid = Array.from({length: numRows}, () => Array(numCols).fill(''));
    
    for (let i = 0; i < text.length; i++) grid[Math.floor(i/numCols)][i%numCols] = text[i];
    
    return sortedKey.map(k => {
        let colStr = "";
        for (let r = 0; r < numRows; r++) colStr += grid[r][k.i];
        return colStr;
    }).join('');
}

function runADFGVX(isDec) {
    const text = document.getElementById('adfgvx-in').value;
    const key = document.getElementById('adfgvx-key').value;
    if (!isDec) {
        let sub = substitute(text);
        document.getElementById('adfgvx-out').value = columnarTransposition(sub, key);
    } else {
        alert("Дешифрование ADFGVX требует точного соблюдения размеров сетки.");
    }
}
