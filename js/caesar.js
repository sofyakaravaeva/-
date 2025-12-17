function caesarCipher(text, key, decrypt) {
    const shift = decrypt ? -key : key;
    return text.split('').map(char => {
        let code = char.charCodeAt(0);
        // English
        if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + shift % 26 + 26) % 26) + 65);
        if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + shift % 26 + 26) % 26) + 97);
        // Russian
        if (code >= 1040 && code <= 1071) return String.fromCharCode(((code - 1040 + shift % 32 + 32) % 32) + 1040);
        if (code >= 1072 && code <= 1103) return String.fromCharCode(((code - 1072 + shift % 32 + 32) % 32) + 1072);
        return char;
    }).join('');
}

function runCaesar(isDec) {
    const input = document.getElementById('caesar-in').value;
    const key = parseInt(document.getElementById('caesar-key').value) || 0;
    document.getElementById('caesar-out').value = caesarCipher(input, key, isDec);
}