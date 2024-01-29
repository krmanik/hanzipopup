// https://github.com/cschiller/zhongwen
async function showPopup(html, elem, x, y, looseWidth) {
    let config = await getConfig();

    if (!x || !y) {
        x = y = 0;
    }

    let popup = document.getElementById('zhongwen-window');

    if (!popup) {
        popup = document.createElement('div');
        popup.setAttribute('id', 'zhongwen-window');
        document.body.appendChild(popup);
    }

    popup.style.width = 'auto';
    popup.style.height = 'auto';
    popup.style.maxWidth = (looseWidth ? '' : '600px');
    popup.className = `background-${config.popupColor} tonecolor-${config.toneColorScheme}`;

    popup.innerHTML = html;

    if (elem) {
        popup.style.top = '-1000px';
        popup.style.left = '0px';
        popup.style.display = '';

        let pW = popup.offsetWidth;
        let pH = popup.offsetHeight;

        if (pW <= 0) {
            pW = 200;
        }
        if (pH <= 0) {
            pH = 0;
            let j = 0;
            while ((j = html.indexOf('<br/>', j)) !== -1) {
                j += 5;
                pH += 22;
            }
            pH += 25;
        }

        if (altView === 1) {
            x = window.scrollX;
            y = window.scrollY;
        } else if (altView === 2) {
            x = (window.innerWidth - (pW + 20)) + window.scrollX;
            y = (window.innerHeight - (pH + 20)) + window.scrollY;
        } else if (elem instanceof window.HTMLOptionElement) {

            x = 0;
            y = 0;

            let p = elem;
            while (p) {
                x += p.offsetLeft;
                y += p.offsetTop;
                p = p.offsetParent;
            }

            if (elem.offsetTop > elem.parentNode.clientHeight) {
                y -= elem.offsetTop;
            }

            if (x + popup.offsetWidth > window.innerWidth) {
                // too much to the right, go left
                x -= popup.offsetWidth + 5;
                if (x < 0) {
                    x = 0;
                }
            } else {
                // use SELECT's width
                x += elem.parentNode.offsetWidth + 5;
            }
        } else {
            // go left if necessary
            if (x + pW > window.innerWidth - 20) {
                x = (window.innerWidth - pW) - 20;
                if (x < 0) {
                    x = 0;
                }
            }

            // below the mouse
            let v = 25;

            // go up if necessary
            if (y + v + pH > window.innerHeight) {
                let t = y - pH - 30;
                if (t >= 0) {
                    y = t;
                }
            } else {
                y += v;
            }

            x += window.scrollX;
            y += window.scrollY;
        }
    } else {
        x += window.scrollX;
        y += window.scrollY;
    }

    // (-1, -1) indicates: leave position unchanged
    if (x !== -1 && y !== -1) {
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        popup.style.display = '';
    }
}

async function makeHtml(result, showToneColors) {
    let config = await getConfig();

    let entry;
    let html = '';
    let texts = [];
    let hanziClass;

    if (result === null) return '';

    for (let i = 0; i < result.data.length; ++i) {
        entry = result.data[i][0].match(/^([^\s]+?)\s+([^\s]+?)\s+\[(.*?)\]?\s*\/(.+)\//);

        if (!entry) continue;

        // Hanzi

        if (config.simpTrad === 'auto') {

            let word = result.data[i][1];

            hanziClass = 'w-hanzi';
            if (config.fontSize === 'small') {
                hanziClass += '-small';
            }
            html += '<span class="' + hanziClass + '">' + word + '</span>&nbsp;';

        } else {

            hanziClass = 'w-hanzi';
            if (config.fontSize === 'small') {
                hanziClass += '-small';
            }
            html += '<span class="' + hanziClass + '">' + entry[2] + '</span>&nbsp;';
            if (entry[1] !== entry[2]) {
                html += '<span class="' + hanziClass + '">' + entry[1] + '</span>&nbsp;';
            }

        }

        // Pinyin

        let pinyinClass = 'w-pinyin';
        if (config.fontSize === 'small') {
            pinyinClass += '-small';
        }
        let p = await pinyinAndZhuyin(entry[3], showToneColors, pinyinClass);
        html += p[0];

        // Zhuyin

        if (config.zhuyin) {
            html += '<br>' + p[2];
        }

        // Definition

        let defClass = 'w-def';
        if (config.fontSize === 'small') {
            defClass += '-small';
        }
        let translation = entry[4].replace(/\//g, ' ◆ ');
        html += '<br><span class="' + defClass + '">' + translation + '</span><br>';

        let addFinalBr = false;

        // Grammar
        if (config['grammar'] && result.grammar && result.grammar.index === i) {
            html += '<br><span class="grammar">Press "g" for grammar and usage notes.</span><br>';
            addFinalBr = true;
        }

        // Vocab
        if (config['vocab'] && result.vocab && result.vocab.index === i) {
            html += '<br><span class="vocab">Press "v" for vocabulary notes.</span><br>';
            addFinalBr = true;
        }

        if (addFinalBr) {
            html += '<br>';
        }

        texts[i] = [entry[2], entry[1], p[1], translation, entry[3]];
    }
    if (result.more) {
        html += '&hellip;<br/>';
    }

    savedSearchResults = texts;
    savedSearchResults.grammar = result.grammar;
    savedSearchResults.vocab = result.vocab;

    return html;
}

function hidePopup() {
    if(!shouldHidePopup()) {
        return;
    }

    let popup = document.getElementById('zhongwen-window');
    if (popup) {
        popup.style.display = 'none';
        popup.textContent = '';
    }
}
