function vigenereCipher(text, key, decrypt) {
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!key) return text;
    let result = '';
    let j = 0;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let code = char.charCodeAt(0);
        if (code >= 65 && code <= 122) { 
            let isUpper = code <= 90;
            let start = isUpper ? 65 : 97;
            let k = key[j % key.length].charCodeAt(0) - 65;
            let shift = decrypt ? (26 - k) : k;
            result += String.fromCharCode(((code - start + shift) % 26) + start);
            j++;
        } else result += char;
    }
    return result;
}

function runVigenere(isDec) {
    const input = document.getElementById('vigenere-in').value;
    const key = document.getElementById('vigenere-key').value;
    document.getElementById('vigenere-out').value = vigenereCipher(input, key, isDec);
}