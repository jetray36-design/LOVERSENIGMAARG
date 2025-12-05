// secure.js
// ciphertext produced by XORing the intended HTML with key "TRIALS" and then base64-encoding.
// (stored here so the plaintext never appears in dialogue.html)
var C = "aDp4fw88OjU7IDgmODM9KCM9J25mKX1tXlh1IzknID0nYS8/NSE6fG43PSEqLj0EdDk0JAE9dR8Uc3B3S2xzdHIKLSUwP3IhJD42dCYmYSY8PTxpNSQ2dAY7KC0/";

// helper helpers (intentionally short names to make quick scanning harder)
function _rev(s){ return s.split('').reverse().join(''); }
function _clean(s){ return s.replace(/~/g,'').replace(/\$/g,''); }
function _b64ToU8(b64){ return Uint8Array.from(atob(b64), c=>c.charCodeAt(0)); }
function _u8ToStr(u8){ return new TextDecoder().decode(u8); }

// reconstruct key from obfuscated token stored by gate.html
function recoverKeyFromSession(){
  try{
    var token = sessionStorage.getItem('z');
    if(!token) return null;
    var cleaned = _clean(token);
    var rev = _rev(cleaned);
    // rev should be base64 of derived rotated string
    var derived = atob(rev);
    // undo rotation: substract (i+3) from char codes to get original password
    var out = [];
    for(var i=0;i<derived.length;i++){
      out.push(String.fromCharCode(derived.charCodeAt(i) - (i+3)));
    }
    return out.join('');
  }catch(e){
    return null;
  }
}

// XOR decrypt bytes with key string
function xorDecrypt(u8, key){
  var out = new Uint8Array(u8.length);
  for(var i=0;i<u8.length;i++){
    out[i] = u8[i] ^ key.charCodeAt(i % key.length);
  }
  return out;
}

// Public function: attempt decrypt and return plaintext string or null
function attemptDecrypt(){
  try{
    var key = recoverKeyFromSession();
    if(!key) return null;
    var ct = _b64ToU8(C);
    var pt = xorDecrypt(ct, key);
    return _u8ToStr(pt);
  }catch(e){
    return null;
  }
}
