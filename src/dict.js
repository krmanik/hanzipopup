// https://github.com/cschiller/zhongwen
class ZhongwenDictionary {

    constructor(wordDict, wordIndex, grammarKeywords, vocabKeywords) {
        this.wordDict = wordDict;
        this.wordIndex = wordIndex;
        this.grammarKeywords = grammarKeywords;
        this.vocabKeywords = vocabKeywords;
        this.cache = {};
    }

    static find(needle, haystack) {

        let beg = 0;
        let end = haystack.length - 1;

        while (beg < end) {
            let mi = Math.floor((beg + end) / 2);
            let i = haystack.lastIndexOf('\n', mi) + 1;

            let mis = haystack.substr(i, needle.length);
            if (needle < mis) {
                end = i - 1;
            } else if (needle > mis) {
                beg = haystack.indexOf('\n', mi + 1) + 1;
            } else {
                return haystack.substring(i, haystack.indexOf('\n', mi + 1));
            }
        }

        return null;
    }

    hasGrammarKeyword(keyword) {
        return this.grammarKeywords[keyword];
    }

    hasVocabKeyword(keyword) {
        return this.vocabKeywords[keyword];
    }

    wordSearch(word, max) {

        let entry = { data: [] };

        let dict = this.wordDict;
        let index = this.wordIndex;

        let maxTrim = max || 7;

        let count = 0;
        let maxLen = 0;

        WHILE:
        while (word.length > 0) {

            let ix = this.cache[word];
            if (!ix) {
                ix = ZhongwenDictionary.find(word + ',', index);
                if (!ix) {
                    this.cache[word] = [];
                    continue;
                }
                ix = ix.split(',');
                this.cache[word] = ix;
            }

            for (let j = 1; j < ix.length; ++j) {
                let offset = ix[j];

                let dentry = dict.substring(offset, dict.indexOf('\n', offset));

                if (count >= maxTrim) {
                    entry.more = 1;
                    break WHILE;
                }

                ++count;
                if (maxLen === 0) {
                    maxLen = word.length;
                }

                entry.data.push([dentry, word]);
            }

            word = word.substr(0, word.length - 1);
        }

        if (entry.data.length === 0) {
            return null;
        }

        entry.matchLen = maxLen;
        return entry;
    }
}

function makeGetRequest(url, responseType = 'text') {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            responseType: responseType,
            onload: function (response) {
                if (response.status === 200) {
                    resolve(response.response);
                } else {
                    reject(new Error(`Request failed with status: ${response.status}`));
                }
            },
            onerror: function (error) {
                reject(new Error(`Request failed with error: ${error}`));
            }
        });
    });
}

async function getCedict(url) {
    let arraybuffer = await makeGetRequest(url, 'arraybuffer');
    const { entries } = await unzipit.unzip(new Uint8Array(arraybuffer));
    const arrayBuffer = await entries['cedict_ts.u8'].arrayBuffer();
    const string = new TextDecoder().decode(arrayBuffer);
    return string;
}

async function loadDictData() {
    let wordDict = getCedict(`${host}/data/cedict_ts.zip`);

    // let wordDict = makeGetRequest(`${host}/data/cedict_ts.u8`);
    let wordIndex = makeGetRequest(`${host}/data/cedict.idx`);
    let grammarKeywords = makeGetRequest(`${host}/data/grammarKeywordsMin.json`, 'json');
    let vocabKeywords = makeGetRequest(`${host}/data/vocabularyKeywordsMin.json`, 'json');

    return Promise.all([wordDict, wordIndex, grammarKeywords, vocabKeywords]);
}

async function loadDictionary() {
    const [wordDict, wordIndex, grammarKeywords, vocabKeywords] = await loadDictData();
    return new ZhongwenDictionary(wordDict, wordIndex, grammarKeywords, vocabKeywords);
}

async function loadDict() {
    try {
        if (dict) {
            return;
        }
        dict = await loadDictionary().then(r => dict = r);
        console.log("Dictionary Loaded...");
    } catch (e) {
        disableTab();
        console.log(e);
    }
}

// regular expression for zero-width non-joiner U+200C &zwnj;
let zwnj = /\u200c/g;

function search(text) {

    if (!dict) {
        return;
    }

    let entry = dict.wordSearch(text);

    if (entry) {
        for (let i = 0; i < entry.data.length; i++) {
            let word = entry.data[i][1];
            if (dict.hasGrammarKeyword(word) && (entry.matchLen === word.length)) {
                // the final index should be the last one with the maximum length
                entry.grammar = { keyword: word, index: i };
            }
            if (dict.hasVocabKeyword(word) && (entry.matchLen === word.length)) {
                // the final index should be the last one with the maximum length
                entry.vocab = { keyword: word, index: i };
            }
        }
    }

    return entry;
}
