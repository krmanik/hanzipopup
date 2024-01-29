// https://github.com/cschiller/zhongwen
function enableTab() {
    document.addEventListener('mousedown', onMouseMove);
    document.addEventListener('touchstart', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
}

function disableTab() {
    document.removeEventListener('mousedown', onMouseMove);
    document.removeEventListener('touchstart', onMouseMove);
    document.removeEventListener('keydown', onKeyDown);

    let popup = document.getElementById('zhongwen-window');
    if (popup) {
        popup.parentNode.removeChild(popup);
    }

    clearHighlight();
}

function saveWordList() {
    let entries = [];
    for (let j = 0; j < savedSearchResults.length; j++) {
        let entry = {
            simplified: savedSearchResults[j][0],
            traditional: savedSearchResults[j][1],
            pinyin: savedSearchResults[j][2],
            definition: savedSearchResults[j][3]
        };
        entries.push(entry);
    }

    if (wordListWindow && !wordListWindow.closed) {
        wordListWindow.postMessage({ message: "requestResult", entries: entries }, "*");
    } else {
        wordListWindow = window.open(`${host}/wordlist.html`);
    }

    let interval = setInterval(function () {
        try {
            wordListWindow.postMessage({ message: "requestResult", entries: entries }, "*");
        } catch (e) {
            if (wordListWindow.closed) {
                clearInterval(interval);
                return;
            }
        }
    }, 500);

    window.addEventListener("message", function (event) {
        if (event.data.message === "deliverResult") {
            clearInterval(interval);
            wordListWindow.postMessage({ message: "refreshPage", refresh: true }, "*");
        }
    }, false);

    showPopup(`Added to word list.<p>Press View button to open word list.`, null, -1, -1);
}

function viewWordList() {
    // Alt + w
    if (!wordListWindow) {
        wordListWindow = window.open(`${host}/wordlist.html`);
    } else {
        wordListWindow.focus();
        wordListWindow.location.href = `${host}/wordlist.html`;
    }
}

function infoWindowOpen(url) {
    if (!infoWindow || infoWindow.closed) {
        infoWindow = window.open(url);
    } else {
        infoWindow.location.href = url;
        infoWindow.focus();
    }
}

function toggleOption() {
    popupContainer.style.display = (popupContainer.style.display === 'none' || popupContainer.style.display === '') ? 'block' : 'none';
}

async function loadVals() {
    let config = await getConfig();

    const popupColor = config['popupColor'] || 'yellow';
    document.querySelector(`input[name="popupColor"][value="${popupColor}"]`).checked = true;

    const toneColorScheme = config['toneColorScheme'] || 'standard';
    if (toneColorScheme === 'none') {
        document.querySelector('#toneColorsNone').checked = true;
    } else {
        document.querySelector(`input[name="toneColors"][value="${toneColorScheme}"]`).checked = true;
    }

    const fontSize = config['fontSize'] || 'small';
    document.querySelector(`input[name="fontSize"][value="${fontSize}"]`).checked = true;

    const simpTrad = config['simpTrad'] || 'classic';
    document.querySelector(`input[name="simpTrad"][value="${simpTrad}"]`).checked = true;

    const saveToWordList = config['saveToWordList'] || 'allEntries';
    document.querySelector(`input[name="saveToWordList"][value="${saveToWordList}"]`).checked = true;

    const cnTtsEngine = config['cnTtsEngine'] || 'browser';
    document.querySelector(`input[name="cnTtsEngine"][value="${cnTtsEngine}"]`).checked = true;

    document.querySelector('#hanzipopup-grammar').checked = config['grammar'];
    document.querySelector('#hanzipopup-vocab').checked = config['vocab'];
    document.querySelector('#hanzipopup-zhuyin').checked = config['zhuyin'];
    document.querySelector('#hanzipopup-tts').checked = config['tts'];
    document.querySelector('#hanzipopup-prev').checked = config['prev'];
    document.querySelector('#hanzipopup-next').checked = config['next'];
    document.querySelector('#hanzipopup-more').checked = config['more'];

    infoButtons.forEach(function (button) {
        document.querySelector(`#hanzipopup-${button.id}`).checked = config[button.id];
    });

    if (config['ttsvoice']) {
        document.querySelector("#voiceSelection").value = config['ttsvoice'];
    } else {
        config['ttsvoice'] = "zh-CN-XiaoxiaoNeural";
        document.querySelector("#voiceSelection").value = "zh-CN-XiaoxiaoNeural";
        await setConfig('ttsvoice', config['ttsvoice']);
    }

    if (config['more']) {
        document.querySelector("#hanzipopup-more-info").style.display = "block";
    } else {
        document.querySelector("#hanzipopup-more-info").style.display = "none";
    }
}

function shouldHidePopup() {
    if (clickedTarget.tagName === "BUTTON") {
        return false;
    }
    return true;
}
