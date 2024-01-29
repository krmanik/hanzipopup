// https://github.com/cschiller/zhongwen
function altViewInfo() {
    altView = (altView + 1) % 3;
    triggerSearch();
}

function copyToClip() {
    copyToClipboard(getTextForClipboard());
}

function copyToClipboard(data) {
    let txt = document.createElement('textarea');
    txt.style.position = "absolute";
    txt.style.left = "-100%";
    txt.value = data;
    document.body.appendChild(txt);
    txt.select();
    document.execCommand('copy');
    document.body.removeChild(txt);

    showPopup('Copied to clipboard', null, -1, -1);
}

function wordPrev() {
    let offset = selStartDelta;
    selStartDelta = --offset;
    let ret = triggerSearch();
    if (ret === 0) {
        return
    } else if (ret === 2) {
        savedRangeNode = findPreviousTextNode(savedRangeNode.parentNode, savedRangeNode);
        savedRangeOffset = 0;
        offset = savedRangeNode.data.length;
    }
}

function wordNext() {
    selStartDelta += selStartIncrement;
    let ret = triggerSearch();
    if (ret === 0) {
        return;
    } else if (ret === 2) {
        savedRangeNode = findNextTextNode(savedRangeNode.parentNode, savedRangeNode);
        savedRangeOffset = 0;
        selStartDelta = 0;
        selStartIncrement = 0;
    }
}

async function grammarInfo() {
    let config = await getConfig();
    if (config['grammar'] && savedSearchResults.grammar) {
        let sel = encodeURIComponent(window.getSelection().toString());

        // https://resources.allsetlearning.com/chinese/grammar/%E4%B8%AA
        let allset = 'https://resources.allsetlearning.com/chinese/grammar/' + sel;
        infoWindowOpen(allset);
    }
}

async function vocabInfo() {
    let config = await getConfig();
    if (config['vocab'] && savedSearchResults.vocab) {
        let sel = encodeURIComponent(window.getSelection().toString());

        // https://resources.allsetlearning.com/chinese/vocabulary/%E4%B8%AA
        let allset = 'https://resources.allsetlearning.com/chinese/vocabulary/' + sel;
        infoWindowOpen(allset);
    }
}

function tatoebaInfo() {
    let sel = encodeURIComponent(window.getSelection().toString());

    // https://tatoeba.org/eng/sentences/search?from=cmn&to=eng&query=%E8%BF%9B%E8%A1%8C
    let tatoeba = 'https://tatoeba.org/eng/sentences/search?from=cmn&to=eng&query=' + sel;
    infoWindowOpen(tatoeba);
}

function movePopupUp() {
    altView = 0;
    popY -= 20;
    triggerSearch();
}

function movePopupDown() {
    altView = 0;
    popY += 20;
    triggerSearch();
}

function lineDictInfo() {
    // use the simplified character for linedict lookup
    let simp = savedSearchResults[0][0];

    // https://english.dict.naver.com/english-chinese-dictionary/#/search?query=%E8%AF%8D%E5%85%B8
    let linedict = 'https://english.dict.naver.com/english-chinese-dictionary/#/search?query=' +
        encodeURIComponent(simp);
    infoWindowOpen(linedict);
}

function forvoInfo() {
    let sel = encodeURIComponent(window.getSelection().toString());

    // https://forvo.com/search/%E4%B8%AD%E6%96%87/zh/
    var forvo = 'https://forvo.com/search/' + sel + '/zh/';
    infoWindowOpen(forvo);

}

function dictInfo() {
    let sel = encodeURIComponent(window.getSelection().toString());

    // https://dict.cn/%E7%BF%BB%E8%AF%91
    let dictcn = 'https://dict.cn/' + sel;
    infoWindowOpen(dictcn);

}

function icibaInfo() {
    let sel = encodeURIComponent(window.getSelection().toString());

    // https://www.iciba.com/%E4%B8%AD%E9%A4%90
    let iciba = 'https://www.iciba.com/' + sel;
    infoWindowOpen(iciba);

}

function mdbgInfo() {
    let sel = encodeURIComponent(window.getSelection().toString());

    // https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=%E4%B8%AD%E6%96%87
    let mdbg = 'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=' + sel;
    infoWindowOpen(mdbg);
}

function reversoInfo() {
    let sel = encodeURIComponent(
        window.getSelection().toString());

    let reverso = 'https://context.reverso.net/translation/chinese-english/' + sel;
    infoWindowOpen(reverso);
}

function moedictInfo() {
    // use the traditional character for moedict lookup
    let trad = savedSearchResults[0][1];

    // https://www.moedict.tw/~%E4%B8%AD%E6%96%87
    let moedict = 'https://www.moedict.tw/~' + encodeURIComponent(trad);
    infoWindowOpen(moedict);
}

let infoButtons = [
    { id: 'grammar_info', label: 'Grammar', func: grammarInfo },
    { id: 'vocab_info', label: 'Vocabulary', func: vocabInfo },
    { id: 'tatoeba_info', label: 'Tatoeba', func: tatoebaInfo },
    { id: 'line_dict_info', label: 'Line Dict', func: lineDictInfo },
    { id: 'forvo_info', label: 'Forvo', func: forvoInfo },
    { id: 'dict_info', label: 'Dict.cn', func: dictInfo },
    { id: 'iciba_info', label: 'Iciba', func: icibaInfo },
    { id: 'mdbg_info', label: 'MDBG', func: mdbgInfo },
    { id: 'reverso_info', label: 'Reverso', func: reversoInfo },
    { id: 'moedict_info', label: 'Moedict', func: moedictInfo }
];

const infoButtonContainer = document.createElement('div');
infoButtonContainer.id = 'zhongwen-info-buttons';
infoButtonContainer.style.display = 'none';

async function setupInfoButtons() {
    let config = await getConfig();

    infoButtons.forEach(function (button) {
        let infoButton = createLabelButton(button.label, button.func);
        infoButton.classList.add('info-button');
        infoButton.id = button.id;

        if (!config[button.id]) {
            infoButton.style.display = 'none';
            config[button.id] = false;
        } else {
            infoButton.style.display = 'inline-block';
            config[button.id] = true;
        }
        infoButtonContainer.appendChild(infoButton);
    });
}

async function updateInfoButtons(id) {
    id = id.replace("hanzipopup-", "");

    let config = await getConfig();
    let infoButton = document.querySelector(`#${id}`);

    if (!config[id]) {
        infoButton.style.display = 'none';
    } else {
        infoButton.style.display = 'inline-block';
    }
}

setupInfoButtons();
document.body.appendChild(infoButtonContainer);

function onKeyDown(keyDown) {
    let sel = window.getSelection().toString();
    if (sel.length === 0) {
        return;
    }

    if (keyDown.ctrlKey || keyDown.metaKey) {
        return;
    }

    if (keyDown.keyCode === 27) {
        // esc key pressed
        hidePopup();
        return;
    }

    if (keyDown.altKey && keyDown.keyCode === 87) {
        // Alt + w
        viewWordList();
        return;
    }

    switch (keyDown.keyCode) {
        case 65: // 'a'
            altViewInfo();
            break;
        case 66: // 'b'
            wordPrev();
            break;
        case 67: // 'c'
            copyToClip();
            break;
        case 68: // 'd'
            disableTab();
            break;
        case 71: // 'g'
            grammarInfo();
            break;
        case 77: // 'm'
            selStartIncrement = 1;
        // falls through
        case 78: // 'n'
            wordNext();
            break;
        case 80: // 'p'
            ttsPlay();
            break;
        case 82: // 'r'
            saveWordList();
            break;
        case 84: // 't'
            tatoebaInfo();
            break;
        case 86: // 'v'
            vocabInfo();
            break;
        case 88: // 'x'
            movePopupUp();
            break;
        case 89: // 'y'
            movePopupDown();
            break;
        case 49: // '1'
            lineDictInfo();
            break;
        case 50: // '2'
            forvoInfo();
            break;
        case 51: // '3'
            dictInfo();
            break;
        case 52: // '4'
            icibaInfo();
            break;
        case 53: // '5'
            mdbgInfo();
            break;
        case 54: // '6'
            reversoInfo();
            break;
        case 55: // '7'
            moedictInfo();
            break;
        default:
            return;
    }
}
