class RC5 {
    constructor() {
        this.w = 32;          // Размер слова в битах
        this.r = 12;          // Количество раундов
        this.b = 16;          // Длина ключа в байтах
        this.P32 = 0xB7E15163;
        this.Q32 = 0x9E3779B9;
    }

    // Циклический сдвиг влево
    rotl(val, shift) {
        return ((val << (shift & 31)) | (val >>> (32 - (shift & 31)))) >>> 0;
    }

    // Циклический сдвиг вправо
    rotr(val, shift) {
        return ((val >>> (shift & 31)) | (val << (32 - (shift & 31)))) >>> 0;
    }

    // Расширение ключа
    expandKey(key) {
        let L = new Uint32Array(4);
        for (let i = 0; i < 16; i++) {
            L[Math.floor(i / 4)] |= (key[i] << (8 * (i % 4))) >>> 0;
        }

        let S = new Uint32Array(2 * (this.r + 1));
        S[0] = this.P32;
        for (let i = 1; i < S.length; i++) {
            S[i] = (S[i - 1] + this.Q32) >>> 0;
        }

        let i = 0, j = 0, A = 0, B = 0;
        let iterations = 3 * Math.max(S.length, L.length);

        for (let k = 0; k < iterations; k++) {
            A = S[i] = this.rotl((S[i] + A + B) >>> 0, 3);
            B = L[j] = this.rotl((L[j] + A + B) >>> 0, (A + B) >>> 0);
            i = (i + 1) % S.length;
            j = (j + 1) % L.length;
        }
        return S;
    }

    // Шифрование одного блока (64 бит)
    encryptBlock(vA, vB, S) {
        let A = (vA + S[0]) >>> 0;
        let B = (vB + S[1]) >>> 0;
        for (let i = 1; i <= this.r; i++) {
            A = (this.rotl(A ^ B, B) + S[2 * i]) >>> 0;
            B = (this.rotl(B ^ A, A) + S[2 * i + 1]) >>> 0;
        }
        return [A, B];
    }

    // Дешифрование одного блока (64 бит)
    decryptBlock(vA, vB, S) {
        let A = vA;
        let B = vB;
        for (let i = this.r; i >= 1; i--) {
            B = this.rotr((B - S[2 * i + 1]) >>> 0, A) ^ A;
            A = this.rotr((A - S[2 * i]) >>> 0, B) ^ B;
        }
        B = (B - S[1]) >>> 0;
        A = (A - S[0]) >>> 0;
        return [A, B];
    }

    pad(data) {
        const padding = 8 - (data.length % 8);
        const padded = new Uint8Array(data.length + padding);
        padded.set(data);
        for (let i = data.length; i < padded.length; i++) padded[i] = padding;
        return padded;
    }

    unpad(data) {
        const padding = data[data.length - 1];
        return data.slice(0, data.length - padding);
    }

    // Метод для вызова из интерфейса
    encode(text, keyStr) {
        const encoder = new TextEncoder();
        const data = this.pad(encoder.encode(text));
        const key = new Uint8Array(16);
        key.set(encoder.encode(keyStr).slice(0, 16));
        
        const S = this.expandKey(key);
        const encrypted = new Uint8Array(data.length);
        const viewIn = new DataView(data.buffer);
        const viewOut = new DataView(encrypted.buffer);

        for (let i = 0; i < data.length; i += 8) {
            let [resA, resB] = this.encryptBlock(viewIn.getUint32(i, true), viewIn.getUint32(i + 4, true), S);
            viewOut.setUint32(i, resA, true);
            viewOut.setUint32(i + 4, resB, true);
        }
        return btoa(String.fromCharCode(...encrypted));
    }

    decode(base64, keyStr) {
        const encrypted = new Uint8Array(atob(base64).split("").map(c => c.charCodeAt(0)));
        const key = new Uint8Array(16);
        key.set(new TextEncoder().encode(keyStr).slice(0, 16));

        const S = this.expandKey(key);
        const decrypted = new Uint8Array(encrypted.length);
        const viewIn = new DataView(encrypted.buffer);
        const viewOut = new DataView(decrypted.buffer);

        for (let i = 0; i < encrypted.length; i += 8) {
            let [resA, resB] = this.decryptBlock(viewIn.getUint32(i, true), viewIn.getUint32(i + 4, true), S);
            viewOut.setUint32(i, resA, true);
            viewOut.setUint32(i + 4, resB, true);
        }
        return new TextDecoder().decode(this.unpad(decrypted));
    }
}

// Функции для связи с HTML-интерфейсом
const rc5 = new RC5();

function genRC5Key() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let res = "";
    for (let i = 0; i < 16; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('rc5-key').value = res;
}

function runRC5(isDec) {
    const input = document.getElementById('rc5-in').value;
    const key = document.getElementById('rc5-key').value;
    const output = document.getElementById('rc5-out');

    if (key.length !== 16) {
        alert("Ключ должен быть ровно 16 символов!");
        return;
    }

    try {
        if (!input) return;
        output.value = isDec ? rc5.decode(input, key) : rc5.encode(input, key);
    } catch (e) {
        alert("Ошибка: " + e.message);
    }
}