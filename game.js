const terminal = document.getElementById("terminal");
const input = document.getElementById("commandInput");

let passcodeEntered = false;
let awaitingProgramChoice = false;
let programChosen = false;

let coinTaken = false;
let paperTaken = false;
let coinPlaced = false;
let paperPlaced = false;
let spiritCalled = false;

let kazukiAskCount = 0;
let harukiAsked = false;
let ryotaAsked = false;
let renjirouAsked = false;

let isPrinting = false;
let hauntMode = false;
let hauntStarted = false;
let finalState = false;
let chantStep = 0;
let questionCount = 0;

// 🔊 7 HAUNT SOUNDS
const hauntSounds = [
    new Audio("1.mp3"),
    new Audio("2.mp3"),
    new Audio("3.mp3"),
    new Audio("4.mp3"),
    new Audio("5.mp3"),
    new Audio("6.mp3"),
    new Audio("7.mp3")
];

// 🔊 Johnny Guitar for final protocol
const johnnyGuitar = new Audio("JohnnyGuitar.mp3");
const kazukiScareSound = new Audio("thesound.mp3");
function print(text = "") {
    terminal.innerHTML += text + "\n";
    terminal.scrollTop = terminal.scrollHeight;
}

function slowPrint(text, delay = 200) {
    isPrinting = true;
    let lines = text.split("\n");
    lines.forEach((line, i) => {
        setTimeout(() => {
            print(line);
            if (i === lines.length - 1) {
                setTimeout(() => { isPrinting = false; }, delay);
            }
        }, delay * i);
    });
}

function overwriteLastLine(text) {
    const lines = terminal.innerHTML.split("\n");
    if (lines.length >= 2) {
        lines[lines.length - 2] = text;
    }
    terminal.innerHTML = lines.join("\n");
    terminal.scrollTop = terminal.scrollHeight;
}

function spellHorizontal(word) {
    if (isPrinting) return;
    isPrinting = true;
    let output = "";
    let delay = 0;
    print("");
    [...word].forEach((letter, index) => {
        delay += 300 + Math.random() * 500;
        setTimeout(() => {
            output += letter + " ";
            overwriteLastLine(output.trim());
            if (index === word.length - 1) {
                setTimeout(() => {
                    isPrinting = false;
                }, 300);
            }
        }, delay);
    });
}

function flashJumpscare(flashes = 10) {
    const scare = document.getElementById("jumpscare");
    scare.style.display = "flex";
    let count = 0;
    const interval = setInterval(() => {
        scare.style.visibility = scare.style.visibility === "hidden" ? "visible" : "hidden";
        count++;
        if (count >= flashes) {
            clearInterval(interval);
            scare.style.display = "none";
            scare.style.visibility = "visible";
        }
    }, 80);
}

// 🔊 START HAUNT AFTER 60s
function startHauntMode() {
    if (hauntStarted) return;
    hauntStarted = true;
    setTimeout(() => {
        hauntMode = true;
        playRandomHauntSequence();
    }, 60000);
}

// 🔀 RANDOM SHUFFLE + RANDOM SPACING
function playRandomHauntSequence() {
    const shuffled = [...hauntSounds].sort(() => Math.random() - 0.5);
    let index = 0;
    function playNext() {
        if (index >= shuffled.length) return;
        const sound = shuffled[index];
        sound.currentTime = 0;
        sound.play();
        sound.onended = function () {
            index++;
            if (index < shuffled.length) {
                const randomDelay = 60000 + Math.random() * 20000;
                setTimeout(() => playNext(), randomDelay);
            }
        };
    }
    playNext();
}

function showHelp() {
    print("Available commands:");
    if (!coinTaken) print("take coin");
    if (!paperTaken) print("take paper");
    if (coinTaken && !coinPlaced) print("place coin");
    if (paperTaken && !paperPlaced) print("place paper");
    if (coinPlaced && paperPlaced && !spiritCalled) print("call spirit");
    if (spiritCalled) print("type your question");
}
function showRule() {
    print("- Don't ask about the dead too much");
    print("- Don't ask more than ${allowedQuesNum}");
    print("- Don't turn around in real life while using the application");
    print("- This application was made by ${authorName}");
    print("- Experiencing abnormal things while using this application is actually normal");
    print("- You take all responsibilities while using the application");
    print("- Version 0.3.4");
}
    

function describeRoom() {
    print("You are standing in a cold, dark room.");
    print("A wooden table sits quietly before you.");
    print("Type HELP.");
    print("Type RULE.");
}

// 🔒 DEBUG COMMANDS
function handleDebugCommands(command) {
    switch(command) {
        case "bypassitall":
            passcodeEntered = true;
            awaitingProgramChoice = true;
            print("DEBUG: Passcode bypassed. You can choose a program.");
            print("\nCHOOSE A PROGRAM TO RUN");
            print("-> CORRUPTED");
            print("-> CORRUPTED");
            print("-> KOKKURI_SAN.EXE");
            return true;
        case "triggerhorrorseq":
            if (!finalState) {
                questionCount = 21;
                checkFinalStateTrigger();
                print("DEBUG: Horror protocol triggered.");
            }
            return true;
        case "setques19":
            questionCount = 19;
            print("DEBUG: Question counter set to 19.");
            return true;
        default:
            return false;
    }
}

// 🔹 COMMAND HANDLER
function handleCommand(cmd) {
    const command = cmd.toLowerCase().trim();

    // debug first
    if (handleDebugCommands(command)) return;

    // FINAL PROTOCOL STATE
    if (finalState) {
        handleFinalProtocol(command);
        return;
    }

    // PASSCODE
    if (!passcodeEntered) {
        if (command === "3123540") {
            passcodeEntered = true;
            print("Passcode accepted.\n");
            slowPrint("Booting...", 400);
            slowPrint("Checking RAM...", 900);
            slowPrint("OK!", 1400);
            setTimeout(() => {
                print("\nCHOOSE A PROGRAM TO RUN");
                print("-> CORRUPTED");
                print("-> CORRUPTED");
                print("-> KOKKURI_SAN.EXE");
                awaitingProgramChoice = true;
            }, 1900);
        } else {
            print("Access denied.");
        }
        return;
    }

    // PROGRAM SELECT
   if (awaitingProgramChoice && !programChosen) {
    if (command === "kokkuri_san.exe") {

        programChosen = true;
        awaitingProgramChoice = false;

        slowPrint("Launching KOKKURI_SAN.EXE...", 300);

        // Wait until slowPrint fully finishes before continuing
        const launchLines = 1; // only 1 line printed
        const launchDelay = 300 * launchLines + 400;

        setTimeout(() => {
            print("");
            describeRoom();
            startHauntMode();   // make sure haunt starts too
        }, launchDelay);

    } else {
        print("Program not found.");
    }
    return;
}

    if (command === "") { show(); return; }
    if (command === "help") return showHelp();
    if (command === "rule") return showRule();
    if (command === "take coin") { if (!coinTaken) { coinTaken = true; print("You picked up the coin."); } return; }
    if (command === "take paper") { if (!paperTaken) { paperTaken = true; print("You picked up the paper."); } return; }
    if (command === "place coin") { if (coinTaken && !coinPlaced) { coinPlaced = true; print("You placed the coin on the table."); } return; }
    if (command === "place paper") { if (paperTaken && !paperPlaced) { paperPlaced = true; print("You placed the paper on the table."); } return; }
    if (command === "call spirit") { if (coinPlaced && paperPlaced && !spiritCalled) { spiritCalled = true; print("..."); slowPrint("The coin begins to move.", 800); slowPrint("It is listening...", 1600); } return; }

    if (spiritCalled) {
        questionCount++;
        handleQuestion(command);
        checkFinalStateTrigger();
        return;
    }

    print("Unknown command.");
}

// 🔹 QUESTION HANDLER
function handleQuestion(q) {
    const question = q.toLowerCase();

    if (question === "who are you") { spellHorizontal("KOKKURI"); return; }
    if (question === "where are you") { spellHorizontal("HERE"); return; }
    if (question.includes("past life") || question.includes("past lives") || question.includes("past live")) { 
        if (question.includes("me") || question.includes("myself") || question.includes("i")) spellHorizontal("CENTIPEDE");
        else spellHorizontal("WHO");
        return;
    }
    if (question.includes("cult woman")) { spellHorizontal("PRETTY"); return; }
    if (question.includes("yoko")) { spellHorizontal("BITTER"); return; }
    if (question.includes("kazuki")) {
    kazukiAskCount++;

    if (kazukiAskCount <= 3) {
        spellHorizontal("DEAD");
    } 
    else {
        spellHorizontal("STOP ASKING");

        setTimeout(() => {
            flashJumpscare(20);

            // Play sound every time scare triggers
            kazukiScareSound.currentTime = 0; // restart sound
            kazukiScareSound.play().catch(()=>{});
            
        }, 1500);
    }

    return;
}
    if (question.includes("haruki")) {
    harukiAsked = true;

    // 1 in 5 chance
    if (Math.random() < 0.1) {
        spellHorizontal("MASTER...");
    } else {
        const responses = ["PLAYFUL", "SUPPORTIVE", "CHEERFUL", "WISE"];
        spellHorizontal(responses[Math.floor(Math.random() * responses.length)]);
    }

    return;
}
   if (question.includes("ryota")) {
    ryotaAsked = true;

    // 10% chance to say "DON'T BE JEALOUS"
    if (Math.random() < 0.1) {
        spellHorizontal("JEALOUSY...");
    } else {
        const responses = ["LOYAL", "THOUGHTFUL", "WARM", "RELIABLE"];
        spellHorizontal(responses[Math.floor(Math.random() * responses.length)]);
    }

    return;
}
    if (question.includes("ren kagami")) { spellHorizontal("HE ISNT REAL"); setTimeout(()=>glitchText("HE IS REAL"),3000); return; }
    if (question.includes("renjirou") || question.includes("renjiro") || (question === "ren" && !question.includes("kagami"))) {
    renjirouAsked = true;

    // 10% chance to say "GOOD BYE MOTHER"
    if (Math.random() < 0.1) {
        spellHorizontal("MOTHER?...MOTHER!!!");
    } else {
        const responses = ["THOUGHTFUL", "WARM", "AFFECTIONATE", "CARING"];
        spellHorizontal(responses[Math.floor(Math.random() * responses.length)]);
    }

    return;
}
    if (question.includes("mom")) { const responses=["MANIPULATIVE","STUBBORN","CONTROLLING","COLD"]; spellHorizontal(responses[Math.floor(Math.random()*responses.length)]); return; }
    if (!question.includes("me") && !question.includes("myself") && !question.includes("i")) { spellHorizontal("NO"); return; }
    spellHorizontal("...");
}

// 🔹 GLITCH EFFECT
function glitchText(finalText) {
    isPrinting = true;
    const glitchChars = "!@#$%^&*()_+=-<>?/\\|{}[]";
    let iterations = 0;
    const interval = setInterval(() => {
        let glitched = "";
        for (let i = 0; i < finalText.length; i++) {
            if (Math.random()<0.4) glitched += glitchChars[Math.floor(Math.random()*glitchChars.length)];
            else glitched += finalText[i];
        }
        overwriteLastLine(glitched);
        iterations++;
        if (iterations>12) {
            clearInterval(interval);
            setTimeout(()=>{overwriteLastLine(finalText); isPrinting=false;},400);
        }
    }, 80);
}

// 🔹 FINAL PROTOCOL TRIGGER
function checkFinalStateTrigger() {
    if (questionCount === 20 && !finalState) {
        isPrinting = true;

        // Wait for any current spellHorizontal to finish
        setTimeout(() => {
            setTimeout(() => {
                startFinalProtocol();
            }, 4000); // 
        }, 2000); // small buffer to ensure last word done
    }
}
function startFinalProtocol() {
    finalState = true;
    isPrinting = true;

    johnnyGuitar.loop = true;
    johnnyGuitar.play().catch(()=>{});

    slowPrint(`
!!! UNAUTHORIZED BREACH !!!
!!! SYSTEM COMPROMISED !!!
!!! DATA CORRUPTION DETECTED !!!
!!! MALICIOUS ACTIVITY FOUND !!!
!!! INITIATING EMERGENCY PROTOCOL !!!
    `, 200);

    setTimeout(() => {
        slowPrint(`
To ensure safety please take a deep breath and chant:
"I accept your guidance" 4 times.
After finish chanting, slowly turn around.
If everything is normal, type yes.
        `, 200);
    }, 1500);
}

// 🔹 FINAL PROTOCOL HANDLER
function handleFinalProtocol(inputText) {
    if (chantStep < 4) {
        chantStep++;
        print(`"I accept your guidance" (${chantStep}/4)`);
        if (chantStep === 4) print('"Please bring salvation to me"');
        return;
    }
  if (inputText.toLowerCase() === "yes" && chantStep === 4) {
    print("Welcome to the family");

    setTimeout(() => {
        slowPrint(asciiArt, 5); // VERY FAST but stable

        setTimeout(() => {
            startCountdown();
        }, 5000);

    }, 1000);

    return;
}
}

// 🔹 ASCII ART
const asciiArt = `
................................................................................
................................................................................
.......................................::.......................................
.......................................=:.......................................
................................................................................
.............................:..................................................
..............................:.:=#%%%%%%%%%%#-..:..............................
............................:*%%%%%%#**%***%%%%%%%+:............................
.........................:%%%%%=:..:=*#%%#+-:..-#%%%%*..........................
.......................-%%%%-.:*%#=:...%*...:=%%+..=%%%#:.......................
.....................:%%%#..#%=.:*%%%%%%%%%%%%+..*%=.:%%%*......................
....................=%%%:.#%:.#%%%#:..:%%:..:%%%%*.:%=.=%%%.....................
...................+%%*.=%::%%%=..:=..=%%:..+...*%%%.+%::%%%:...................
.................-=%%*.*#.+%%%%%:.....:=-......=%%%%%::%-.%%%:=.................
..................%%#:*#.*%%..:%%++==+%=#%====*%%..:%%-:%=-%%%..................
.................%%%:-%.=%%:....+=%*=%%..%%-*%=-....=%%:=%.-%%=.................
.................%%*.*=:%%:..:.*+%*:%%==:#%%:%%==.:..*%#.#=:%%%.................
................:%%=.%-=%%...::=%%-=%%%%%%%%==%%=:...:%%.+*.%%%.................
..........+%...-#%%%%%%%%%%%%%++%%:*%%%%%%%%=:%%--%%%%%%%%%%%%%*:..=%-..........
................:%%=.%-=%%....:=%%-=%%%%%%%%-=%%=....-%%.+*.%%%.................
.................%%*.*=:%%:..:.*+%%:%%+:.%%%.%%==.:..*%#.#=:%%%.................
.................%%%::%:=%%:....+=%#:%%..%%:%#=-....+%%:=%.=%%-.................
..................%%#-*#.+%%..-%%*+=+-%=#%-=+=#%%:.-%%::%=-%%%..................
................::=%%*.+%.=%%%%%:.....:::......-%%%%%::%::%%%.-.................
...................=%%*.-%-:%%%*..:=..=%%:..+..:#%%%.*%::%%%:...................
....................-%%%:.*%:.#%%%%:..:%%:.:=%%%%=.=%-.+%%%.....................
......................#%%%:.+%*..+%%%%%%%%%%%*=.:#%-.=%%%=......................
.......................:%%%%-..+%%=:...%*..:-*%#=..+%%%*........................
..........................*%%%%#:..::-=%*=-:...=%%%%%=..........................
............................:+%%%%%%%%#%##%%%%%%%%=.............................
..............................:..:*%%%%%%%%%%+:..:..............................
.............................:..................................................
................................................................................
.......................................+:.......................................
.......................................:........................................
................................................................................
................................................................................
`;
function startCountdown() {
    let count = 10;

    function next() {
        if (count > 0) {
            print(`THIS APPLICATION WILL BE TERMINATED IN ${count}`);
            count--;
            setTimeout(next, 800);
        } else {
            setTimeout(glitchWipe, 800);
        }
    }

    next();
}

function glitchWipe() {
    let iterations = 0;
    const chars = "█▓▒░#@!$%&*";

    const interval = setInterval(() => {
        let block = "";
        for (let i = 0; i < 300; i++) {
            block += chars[Math.floor(Math.random() * chars.length)];
        }
        terminal.innerHTML = block;

        iterations++;
        if (iterations > 25) {
            clearInterval(interval);
            closeConsole();
        }
    }, 40);
}

function closeConsole() {
    johnnyGuitar.pause();
    terminal.innerHTML = "";
    input.disabled = true;
}
// 🔒 BLOCK ENTER WHILE PRINTING
input.addEventListener("keydown", function(e) {
    if (isPrinting) { e.preventDefault(); return; }
    if (e.key === "Enter") {
        const cmd = input.value;
        print("C:\\Lib_LenovoP44\\Users\\663201>" + cmd);
        handleCommand(cmd);
        input.value = "";
    }
});

// BOOT TEXT
print("C:\\Lib_LenovoP44\\Users\\663201>Run.exe");

print("Enter passcode.");






