// PASSWORD REQUIRED
const PASSWORD = "999193";

// SECRET DIALOGUE (plaintext)
const dialogueHTML = `
<p>
Figure A: Marriage? To who?!<br><br>
Figure B: To me.<br><br>
For a moment, ▆▆▆ looks almost broken. Their voice drops to a whisper.<br><br>
Figure B: Please… please, just say my name once more.<br><br>
▆▆▆ kneels before ▆▆▆, their hands trembling as they hover just short of touching ▆▆▆.<br><br>
Figure B: So that all these years of waiting, of this endless torture, would mean something.<br><br>
Figure A: I… I don’t know you.<br><br>
▆▆▆ eyes flicker with disbelief, then something far darker.<br><br>
Figure B: You don’t… know me?<br><br>
A bitter laugh escapes ▆▆▆ lips.<br><br>
Figure B: I was once… no—<br><br>
▆▆▆ pauses, their voice faltering, caught between grief and rage.<br><br>
Figure B: I am your everything.<br>
</p>
`;

// --- UTF-8 SAFE ENCODER ---
function utf8_to_b64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// --- UTF-8 SAFE DECODER ---
function b64_to_utf8(str) {
    return decodeURIComponent(escape(atob(str)));
}

const encrypted = utf8_to_b64(dialogueHTML);

// Unlock function
function loadContent() {
    const pwd = document.getElementById("pwd").value;

    if (pwd !== PASSWORD) {
        alert("Incorrect password");
        return;
    }

    try {
        const decrypted = b64_to_utf8(encrypted);
        const content = document.getElementById("content");
        content.innerHTML = decrypted;
        content.style.display = "block";
    } catch (e) {
        console.error("Decryption error:", e);
        alert("Error loading encrypted content.");
    }
}
