<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>

// PASSWORD REQUIRED
const PASSWORD = "999193";

// Encrypted AES blob (will be generated from plaintext)
const encryptedContent = "U2FsdGVkX1+78vLMyC55MVY4HNpnjlzqgqKv2iWg8Ht6a1ArHUOaKkhhR3YZz7/docmY6R8HfuT71zMYM6wVCb3u66EU5rx25i0uJSzsGBUauY1ybk52iuviLU+HkL9JqJXFcRZL8f9dY5lEwbZ4Vh35LMnm1w3nMuNtOGVcst/fkUO15K5rr8m9lausTz9GE4zwAuuxopmJ4Bl/QXb5GgeO8SjpTVz+3o1pLND9qNLxUHJGNSh5eKwmqLgnRC7v0Tg+Y5qtdlXp0s06wvdjgXpkJ3SyazgoCijHkYXNAED2Sx41Z2MGOH3jcbvLFncyCqGpsYpH8SJzO0cQt4ogWJwPY=";

// Load and decrypt
function loadContent() {
    const pwd = document.getElementById("pwd").value;

    if (pwd !== PASSWORD) {
        alert("Incorrect password");
        return;
    }

    try {
        const bytes = CryptoJS.AES.decrypt(encryptedContent, PASSWORD);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        if (!decrypted) throw new Error();

        document.getElementById("content").innerHTML = decrypted;
        document.getElementById("content").style.display = "block";
    } catch (err) {
        alert("Error loading encrypted content.");
        console.error(err);
    }
}
