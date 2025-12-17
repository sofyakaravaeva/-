class ElGamal {
    constructor() { this.p = 257n; this.g = 3n; this.x = null; this.y = null; }
    modPow(base, exp, mod) {
        let res = 1n; base %= mod;
        while (exp > 0n) {
            if (exp % 2n === 1n) res = (res * base) % mod;
            base = (base * base) % mod; exp /= 2n;
        }
        return res;
    }
    generateKeys() {
        this.x = BigInt(Math.floor(Math.random() * 200) + 2);
        this.y = this.modPow(this.g, this.x, this.p);
        return { p: this.p.toString(), g: this.g.toString(), y: this.y.toString(), x: this.x.toString() };
    }
}
const elgamal = new ElGamal();

function uiGenerateKeys() {
    const k = elgamal.generateKeys();
    document.getElementById('pubP').value = k.p;
    document.getElementById('pubG').value = k.g;
    document.getElementById('pubY').value = k.y;
    document.getElementById('privX').value = k.x;
}

function uiEncrypt() {
    const text = document.getElementById('eg-in').value;
    const bytes = new TextEncoder().encode(text);
    const encrypted = Array.from(bytes).map(b => {
        let k = 7n; 
        let a = elgamal.modPow(elgamal.g, k, elgamal.p);
        let b_val = (elgamal.modPow(elgamal.y, k, elgamal.p) * BigInt(b)) % elgamal.p;
        return `${a}:${b_val}`;
    }).join('; ');
    document.getElementById('eg-out').value = encrypted;
}