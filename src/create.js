let savedTarget;
let savedRangeNode;
let savedRangeOffset;
let savedTtsStr;
let selText;
let clientX;
let clientY;
let selStartDelta;
let selStartIncrement;
let popX = 0;
let popY = 0;
let timer;
let altView = 0;
let savedSearchResults = [];
let savedSelStartOffset = 0;
let savedSelEndList = [];
let dict;
let enable = false;
let host = "https://krmanik.github.io/hanzipopup";
let wordListWindow;
let infoWindow;
let clickedTarget;

function createLabel(labelText, icon) {
    let labelIcon = document.createElement('div');
    labelIcon.classList.add("h-icon-btn");
    labelIcon.classList.add("init");
    labelIcon.classList.add(icon.name);
    labelIcon.style.background = icon.color;

    let labelDiv = document.createElement('div');
    labelDiv.style.marginLeft = '4px';
    labelDiv.innerHTML = labelText;
    let label = document.createElement('label');
    label.classList.add("custom-popup-label");
    label.appendChild(labelIcon);
    label.appendChild(labelDiv);
    return label;
}

function createRadioFormGroup(labelText, groupName, options, icon) {
    let formGroup = document.createElement('div');
    formGroup.id = groupName;
    formGroup.style.marginBottom = '20px';
    formGroup.style.textAlign = "left";

    let label = createLabel(labelText, icon);
    formGroup.appendChild(label);

    options.forEach(option => {
        let radioDiv = document.createElement('div');
        radioDiv.classList.add("option-div");

        let radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.id = option.id;
        radioInput.name = groupName;
        radioInput.value = option.value;
        radioInput.addEventListener('change', () => {
            setConfig(groupName, option.value);
        });

        let radioLabel = document.createElement('label');
        radioLabel.style.marginLeft = '4px';
        radioLabel.style.fontSize = '16px';
        radioLabel.htmlFor = option.id;
        radioLabel.innerHTML = option.label;

        radioDiv.appendChild(radioInput);
        radioDiv.appendChild(radioLabel);
        formGroup.appendChild(radioDiv);
    });
    return formGroup;
}

function createCheckboxFormGroup(id, labelText, options, svg) {
    let formGroup = document.createElement('div');
    formGroup.id = id;
    formGroup.style.marginBottom = '20px';
    formGroup.style.textAlign = "left";

    let label = createLabel(labelText, svg);
    formGroup.appendChild(label);

    options.forEach(option => {
        let checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add("option-div");

        let checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.id = `hanzipopup-${option.id}`;
        checkboxInput.name = `hanzipopup-${option.id}`;
        checkboxInput.addEventListener('click', async (e) => {
            setTimeout(async () => {
                await setConfig(option.id, checkboxInput.checked);
            }, 50);
            setTimeout(async () => {
                if (checkboxInput.id === "hanzipopup-more") {
                    let config = await getConfig();
                    let moreInfo = document.querySelector("#hanzipopup-more-info");
                    if (config['more']) {
                        moreInfo.style.display = "block";
                        moreInfo.scrollIntoView();
                    } else {
                        moreInfo.style.display = "none";
                        moreInfo.scrollIntoView();
                    }
                } else if (checkboxInput.id.includes("_info")) {
                    await updateInfoButtons(checkboxInput.id);
                }
                await setupToolbar();
            }, 100);
        });

        let checkboxLabelElem = document.createElement('label');
        checkboxLabelElem.style.marginLeft = "4px";
        checkboxLabelElem.style.fontSize = '16px';
        checkboxLabelElem.htmlFor = option.id;
        checkboxLabelElem.innerHTML = option.label;

        checkboxDiv.appendChild(checkboxInput);
        checkboxDiv.appendChild(checkboxLabelElem);
        formGroup.appendChild(checkboxDiv);
    });
    return formGroup;
}

function createLabelButton(text, clickCallback) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.className = "unselectable";
    button.addEventListener('click', clickCallback);
    return button;
}

async function createLangList(langList) {
    let config = await getConfig();

    let container = document.createElement("div");
    container.style.margin = "8px 0px 8px 20px";
    container.style.width = "80%";
    container.style.display = "inline-block";
    container.id = "tts-voice-select";

    if (!config["tts"]) {
        container.style.display = "none";
    }

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", "voiceSelection");
    labelElement.textContent = "Select voice";

    let selectElement = document.createElement("select");
    selectElement.id = "voiceSelection";
    selectElement.name = "voiceSelection";
    selectElement.style.width = "90%";
    selectElement.addEventListener("change", async (e) => {
        selectElement.value = e.target.value;
        config['ttsvoice'] = selectElement.value;
        await setConfig('ttsvoice', config['ttsvoice']);
    });

    for (let i = 0; i < langList.length; i++) {
        let option = document.createElement("option");
        option.value = langList[i].ShortName;
        option.textContent = langList[i].FriendlyName + " (" + langList[i].Gender + ")";
        selectElement.add(option);
    }

    container.appendChild(labelElement);
    container.appendChild(selectElement);
    document.querySelector("#cnTtsEngineEdge").parentElement.appendChild(container);
}

async function ttsPlay() {
    let hanzi = savedSearchResults[0][0];
    let config = await getConfig();
    let cnTtsEngine = config['cnTtsEngine'] || 'browser';

    if (cnTtsEngine === 'browser') {
        let utterance = new SpeechSynthesisUtterance(hanzi);
        utterance.lang = "zh-CN";
        speechSynthesis.speak(utterance);
    } else {
        edgeTtsPlay(hanzi, config['ttsvoice']);
    }
}

function toggleFeature() {
    if (enable) {
        disableTab();
        document.querySelector("#hanzi-popup-enable-btn > button").style.background = "#a1a1a1";
        document.getElementById("hanzipopup-fab-btn").style.borderBottom = "unset";
    } else {
        enableTab();
        document.querySelector("#hanzi-popup-enable-btn > button").style.background = "#33b249";
        document.getElementById("hanzipopup-fab-btn").style.borderBottom = "4px solid #31eb3f";
    }
    enable = !enable;
    setConfig('enable', enable);
}

let buttonList = {
    'option': { func: toggleOption, color: "#424769" },
    'view': { func: viewWordList, color: "#3E64FF" },
    'save': { func: saveWordList, color: "#3E64FF" },
    'more-info': { func: toggleMore, color: "#5C6BC0" },
    'next': { func: wordNext, color: "#5C6BC0" },
    'prev': { func: wordPrev, color: "#5C6BC0" },
    'tts': { func: ttsPlay, color: "#5C6BC0" },
    'enable': { func: toggleFeature, color: "#a1a1a1" }
};

const fabContainer = document.createElement("div");
fabContainer.id = "hanzipopup-fab-container";
fabContainer.classList.add('right');
const fabElement = document.createElement('button');
fabElement.id = "hanzipopup-fab-btn";
fabElement.classList.add("h-icon-btn");
fabElement.classList.add("pinyin");
fabElement.classList.add("fab-btn");

async function setupToolbar() {
    let config = await getConfig();

    let elementsToRemove = [];

    if (!config['tts']) {
        elementsToRemove.push('tts');
        document.querySelector("#cnTtsEngine").style.display = "none";
    } else {
        document.querySelector("#cnTtsEngine").style.display = "unset";
        document.querySelector("#cnTtsEngine").value = config['cnTtsEngine'];
    }

    if (!config['prev']) {
        elementsToRemove.push('prev');
    }
    if (!config['next']) {
        elementsToRemove.push('next');
    }
    if (!config['more']) {
        elementsToRemove.push('more-info');
    }

    let filteredButtonList = Object.keys(buttonList).reduce((result, key) => {
        if (!elementsToRemove.includes(key)) {
            result[key] = buttonList[key];
        }
        return result;
    }, {});

    let windowWidth = window.innerWidth;
    fabContainer.style.left = windowWidth - 38 + "px";
    fabContainer.style.top = window.innerHeight - 38 + "px";

    let toolList = document.querySelector("#hanzipopup-tools");
    if (toolList) {
        toolList.innerHTML = "";
    } else {
        toolList = document.createElement("ul");
        toolList.id = "hanzipopup-tools";
    }

    fabContainer.appendChild(toolList);

    for (let key in filteredButtonList) {
        const liElem = document.createElement("li");
        liElem.onclick = filteredButtonList[key].func;
        liElem.id = `hanzi-popup-${key}-btn`

        let icon = document.createElement("button");
        icon.classList.add("h-icon-btn");
        icon.classList.add(key);
        icon.style.background = filteredButtonList[key].color;

        liElem.appendChild(icon)
        toolList.appendChild(liElem);
    }

    if (config['enable']) {
        document.querySelector("#hanzi-popup-enable-btn > button").style.background = "#33b249";
        document.getElementById("hanzipopup-fab-btn").style.borderBottom = "4px solid #31eb3f";
    }

    let oldPositionX = fabContainer.style.left;
    let oldPositionY = fabContainer.style.top;

    const move = (e) => {
        if (e.type === "touchmove") {
            fabContainer.style.top = e.touches[0].clientY + "px";
            fabContainer.style.left = e.touches[0].clientX + "px";
        } else {
            fabContainer.style.top = e.clientY + "px";
            fabContainer.style.left = e.clientX + "px";
        }
    };

    const mouseDown = (e) => {
        oldPositionY = fabContainer.style.top;
        oldPositionX = fabContainer.style.left;
        if (e.type === "mousedown") {
            window.addEventListener("mousemove", move);
        } else {
            window.addEventListener("touchmove", move);
        }

        fabContainer.style.transition = "none";
    };

    const mouseUp = (e) => {
        if (e.type === "mouseup") {
            window.removeEventListener("mousemove", move);
        } else {
            window.removeEventListener("touchmove", move);
        }
        snapToSide(e);
        fabContainer.style.transition = "0.3s ease-in-out left";
    };

    const snapToSide = (e) => {
        windowWidth = window.innerWidth;
        let currPositionX, currPositionY;

        if (e.type === "touchend") {
            currPositionX = e.changedTouches[0].clientX;
            currPositionY = e.changedTouches[0].clientY;
        } else {
            currPositionX = e.clientX;
            currPositionY = e.clientY;
        }
        if (currPositionY < 38) {
            fabContainer.style.top = 38 + "px";
        }
        if (currPositionX < windowWidth / 2) {
            if (!isFabButtonClicked(e)) {
                return;
            }
            fabContainer.style.left = 30 + "px";
            fabContainer.classList.remove('right');
            fabContainer.classList.add('left');
        } else {
            if (!isFabButtonClicked(e)) {
                return;
            }
            fabContainer.style.left = windowWidth - 38 + "px";
            fabContainer.classList.remove('left');
            fabContainer.classList.add('right');
        }
    };

    fabContainer.addEventListener("mousedown", mouseDown);
    fabContainer.addEventListener("mouseup", mouseUp);
    fabContainer.addEventListener("touchstart", mouseDown);
    fabContainer.addEventListener("touchend", mouseUp);
    fabContainer.addEventListener("click", (e) => {
        // console.log({ oldPositionX, oldPositionY, currentX: fabContainer.style.left, currentY: fabContainer.style.top, clientX: e.clientX, clientY: e.clientY })
        if (oldPositionY === fabContainer.style.top && oldPositionX === fabContainer.style.left) {
            if (isFabButtonClicked(e)) {
                fabContainer.classList.toggle("fab-active");
                return;
            }
        }
    });
    function isFabButtonClicked(e) {
        if (e.target.id === "hanzipopup-fab-btn") {
            return true;
        }
        return false;
    }
}

function toggleMore(e) {
    infoButtonContainer.style.left = e.clientX - 40 + "px";
    if (e.clientY < 400) {
        infoButtonContainer.style.top = e.clientY + 20 + "px";
    } else {
        infoButtonContainer.style.bottom = window.innerHeight - e.clientY + 28 + "px";
    }
    infoButtonContainer.style.display = infoButtonContainer.style.display === 'none' ? 'flex' : 'none';
}

// Background color of the pop-up window
const formGroupColors = createRadioFormGroup('Popup Background Color', 'popupColor',
    [{ id: 'popupColorYellow', value: 'yellow', label: 'Yellow pop-up background' },
    { id: 'popupColorBlue', value: 'blue', label: 'Blue pop-up background' },
    { id: 'popupColorLightBlue', value: 'lightblue', label: 'Light blue pop-up background' },
    { id: 'popupColorBlack', value: 'black', label: 'Black pop-up background' }],
    { name: 'popup', color: "#de4e4e" }
);
formGroupColors.style.marginTop = '8px';

// Coloring pinyin syllables based on the tone of the character
const formGroupToneColors = createRadioFormGroup(
    'Pinyin Color',
    'toneColors',
    [{ id: 'toneColorsStandard', value: 'standard', label: 'Use the default color scheme.' },
    { id: 'toneColorsPleco', value: 'pleco', label: 'Use the <a href="https://pleco.com" target="_blank">Pleco</a> color scheme.' },
    { id: 'toneColorsHanping', value: 'hanping', label: 'Use the <a href="https://hanpingchinese.com/" target="_blank">Hanping</a> color scheme.' },
    { id: 'toneColorsNone', value: 'none', label: 'Don\'t show any tone colors.' }],
    { name: 'pinyin', color: "#34d941" }
);

// Font size of the characters in the pop-up window
const formGroupFontSize = createRadioFormGroup('Font Size', 'fontSize',
    [{ id: 'fontSizeSmall', value: 'small', label: 'Display characters in a smaller font size.' },
    { id: 'fontSizeLarge', value: 'large', label: 'Display characters in a larger font size.' }],
    { name: 'font', color: "#6272cf" }
);

// Simplified and traditional characters
const formGroupSimpTrad = createRadioFormGroup('Simplified & Traditional Characters', 'simpTrad',
    [{ id: 'simpTradClassic', value: 'classic', label: 'Display both simplified and traditional characters.' },
    { id: 'simpTradAuto', value: 'auto', label: 'Use the character style automatically detected on the page (either simplified or traditional).' }],
    { name: 'zi', color: "#ff9800" }
);

// Saving entries to the Built-in Word List
const formGroupSaveToWordList = createRadioFormGroup('Save Words', 'saveToWordList',
    [{ id: 'saveToWordListAllEntries', value: 'allEntries', label: 'Save all entries.' },
    { id: 'saveToWordListFirstEntryOnly', value: 'firstEntryOnly', label: 'Save only the first entry.' }],
    { name: 'save', color: "#3E64FF" }
);

// Saving entries to the Built-in Word List
const formGroupTtsEngine = createRadioFormGroup('Text to Speech Engine', 'cnTtsEngine',
    [{ id: 'cnTtsEngineBrowser', value: 'browser', label: 'Use Browser Speech Synthesis' },
    { id: 'cnTtsEngineEdge', value: 'msedge', label: 'Use MS Edge TTS' }],
    { name: 'tts', color: "#3E64FF" }
);

// Additional Chinese transliterations
const formGroupAdditional = createCheckboxFormGroup('optional-feature', 'Optional Feature',
    [{ id: 'zhuyin', label: 'Show <a href="https://wikipedia.org/wiki/Bopomofo" target="_blank">Zhuyin (Bopomofo)</a> phonetic symbols.' },
    { id: 'tts', label: 'Text to Speech for selected Chinese characters' },
    { id: 'prev', label: 'Select previous Chinese character' },
    { id: 'next', label: 'Select next Chinese character' },
    { id: 'more', label: 'Show more button to display additional information' }],
    { name: 'translate', color: "#ff7043" }
);

// Grammar and usage notes
const formGroupGrammarNotes = createCheckboxFormGroup('grammar-vocab', 'Grammar & Vocabulary Notes', [{ id: 'grammar', label: 'Show grammar and usage notes' }, { id: 'vocab', label: 'Show vocabulary notes' }], { name: 'book', color: "#efa22f" });

const grammarNotesInfo = document.createElement('div');
grammarNotesInfo.style.marginLeft = '4px';
grammarNotesInfo.innerHTML = 'Grammar and usage notes from the <a href="https://resources.allsetlearning.com/chinese/grammar" target="_blank">Chinese Grammar Wiki</a>.';
grammarNotesInfo.innerHTML += '<br>';
grammarNotesInfo.innerHTML += 'Vocabulary notes from the <a href="https://resources.allsetlearning.com/chinese/vocabulary" target="_blank">Chinese Vocabulary Wiki</a>.';
formGroupGrammarNotes.appendChild(grammarNotesInfo);

// More information list button
const formGroupMoreInfo = createCheckboxFormGroup('hanzipopup-more-info', 'More Info', infoButtons, { name: 'message', color: "#4caf50" });

// create header title
const headerTitle = document.createElement('div');
headerTitle.textContent = 'Options';
headerTitle.style.fontSize = '20px';
headerTitle.style.fontWeight = 'bold';

const titleContainer = document.createElement('div');
titleContainer.id = 'custom-title-container';

const closeBtn = document.createElement("button");
closeBtn.classList.add("h-icon-btn");
closeBtn.classList.add("init");
closeBtn.classList.add("close");
closeBtn.style.background = "red";
closeBtn.onclick = toggleOption;

titleContainer.appendChild(headerTitle);
titleContainer.appendChild(closeBtn);

// Create popup container element
const popupContainer = document.createElement('div');
popupContainer.id = 'custom-popup-container';
popupContainer.style.display = 'none';

// Create zhongwen config container element
const zhongwenPopupContainer = document.createElement('div');
zhongwenPopupContainer.id = 'zhongwenPopupContainer';

zhongwenPopupContainer.appendChild(formGroupColors);
zhongwenPopupContainer.appendChild(formGroupToneColors);
zhongwenPopupContainer.appendChild(formGroupFontSize);
zhongwenPopupContainer.appendChild(formGroupSimpTrad);
zhongwenPopupContainer.appendChild(formGroupSaveToWordList);
zhongwenPopupContainer.appendChild(formGroupGrammarNotes);
zhongwenPopupContainer.appendChild(formGroupAdditional);
zhongwenPopupContainer.appendChild(formGroupTtsEngine);
zhongwenPopupContainer.appendChild(formGroupMoreInfo);

popupContainer.appendChild(titleContainer);
popupContainer.appendChild(zhongwenPopupContainer);
document.body.appendChild(popupContainer);
createLangList(langList);
setupToolbar();
fabContainer.append(fabElement);
document.body.appendChild(fabContainer);
