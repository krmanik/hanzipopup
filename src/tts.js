// https://gist.github.com/likev/c36fcc8a08ba1a2c5d08f9c7d806a0ad
// JS port of https://github.com/Migushthe2nd/MsEdgeTTS

let socket = null;
let ttsText = null;
let ttsWindow = null;
let ttsError = false;
let ttsAudio = new Audio("");

let langList = [{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)",
    "ShortName": "zh-CN-XiaoxiaoNeural",
    "Gender": "Female",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["News", "Novel"], "VoicePersonalities": ["Warm"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoyiNeural)",
    "ShortName": "zh-CN-XiaoyiNeural",
    "Gender": "Female",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Xiaoyi Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Cartoon", "Novel"], "VoicePersonalities": ["Lively"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, YunjianNeural)",
    "ShortName": "zh-CN-YunjianNeural",
    "Gender": "Male",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Yunjian Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Sports", " Novel"], "VoicePersonalities": ["Passion"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, YunxiNeural)",
    "ShortName": "zh-CN-YunxiNeural",
    "Gender": "Male",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Yunxi Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Novel"], "VoicePersonalities": ["Lively", "Sunshine"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, YunxiaNeural)",
    "ShortName": "zh-CN-YunxiaNeural",
    "Gender": "Male",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Yunxia Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Cartoon", "Novel"], "VoicePersonalities": ["Cute"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, YunyangNeural)",
    "ShortName": "zh-CN-YunyangNeural",
    "Gender": "Male",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Yunyang Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["News"], "VoicePersonalities": ["Professional", "Reliable"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN-liaoning, XiaobeiNeural)",
    "ShortName": "zh-CN-liaoning-XiaobeiNeural",
    "Gender": "Female",
    "Locale": "zh-CN-liaoning",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Xiaobei Online (Natural) - Chinese (Northeastern Mandarin)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Dialect"], "VoicePersonalities": ["Humorous"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN-shaanxi, XiaoniNeural)",
    "ShortName": "zh-CN-shaanxi-XiaoniNeural",
    "Gender": "Female",
    "Locale": "zh-CN-shaanxi",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Xiaoni Online (Natural) - Chinese (Zhongyuan Mandarin Shaanxi)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Dialect"], "VoicePersonalities": ["Bright"] }
}];

function create_edge_TTS({ voice = "zh-CN-XiaoxiaoNeural", timeout = 10, auto_reconnect = true } = {}) {
    const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
    // const VOICES_URL = `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`;
    const SYNTH_URL = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}`;
    const BINARY_DELIM = "Path:audio\r\n";
    const VOICE_LANG_REGEX = /\w{2}-\w{2}/;

    let _outputFormat = "audio-24khz-48kbitrate-mono-mp3";
    let _voiceLocale = 'zh-CN';
    let _voice = voice;
    const _queue = { message: [], url_resolve: {}, url_reject: {} };
    let ready = false;

    function _SSMLTemplate(input) {
        return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${_voiceLocale}">
                  <voice name="${_voice}">
                      ${input}
                  </voice>
              </speak>`;
    }

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    create_new_ws();

    function setFormat(format) {
        if (format) {
            _outputFormat = format;
        }
        socket.send(`Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n
                      {
                          "context": {
                              "synthesis": {
                                  "audio": {
                                      "metadataoptions": {
                                          "sentenceBoundaryEnabled": "false",
                                          "wordBoundaryEnabled": "false"
                                      },
                                      "outputFormat": "${_outputFormat}" 
                                  }
                              }
                          }
                      }
                  `);
    }

    async function createURL(requestId) {
        let index_message = 0;
        for (let message of _queue.message) {
            const isbinary = message instanceof Blob;

            if (!isbinary) {
                continue;
            }

            const data = await message.text();
            const Id = /X-RequestId:(.*?)\r\n/gm.exec(data)[1];

            if (Id !== requestId) {
                continue;
            }

            if (data.charCodeAt(0) === 0x00 && data.charCodeAt(1) === 0x67 && data.charCodeAt(2) === 0x58) {
                // Last (empty) audio fragment
                const blob = new Blob(_queue[requestId], { 'type': 'audio/mp3' });
                _queue[requestId] = null;
                const url = URL.createObjectURL(blob);
                _queue.url_resolve[requestId](url);
            } else {
                const index = data.indexOf(BINARY_DELIM) + BINARY_DELIM.length;
                const audioData = message.slice(index);
                _queue[requestId].push(audioData);
                _queue.message[index_message] = null;
            }
            ++index_message;
        }
    }

    function onopen(event) {
        setFormat();
        ready = true;
    }

    async function onmessage(event) {
        const isbinary = event.data instanceof Blob;
        _queue.message.push(event.data)
        if (!isbinary) {
            const requestId = /X-RequestId:(.*?)\r\n/gm.exec(event.data)[1];
            if (event.data.includes("Path:turn.end")) {
                createURL(requestId);
                addLoading(false);
            }
        }
    }

    function onerror(event) {
        ready = false;
        addLoading(false);
    }

    function onclose(event) {
        ready = false;
        addLoading(false);
    }

    function addSocketListeners() {
        socket.addEventListener('open', onopen);
        socket.addEventListener('message', onmessage);
        socket.addEventListener('error', onerror);
        socket.addEventListener('close', onclose);
    }

    function create_new_ws() {
        try {
            if (ttsError) {
                addLoading(false);
                return;
            }

            socket = new WebSocket(SYNTH_URL);

            socket.onerror = function (event) {
                ttsError = true;
                ttsPostMessage();
                addLoading(false);
            }

            addSocketListeners();
        } catch (e) {
            console.log(e);
        }
    }

    let toStream = function (input) {
        let requestSSML = _SSMLTemplate(input);
        const requestId = uuidv4().replaceAll('-', '');
        const request = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n` + requestSSML.trim();

        _queue[requestId] = [];

        return new Promise((resolve, reject) => {
            _queue.url_resolve[requestId] = resolve, _queue.url_reject[requestId] = reject;

            if (!ready) {
                if (auto_reconnect) {
                    create_new_ws();
                    socket.addEventListener('open', _ => socket.send(request));

                    setTimeout(_ => { if (!ready) reject('reconnect timeout') }, timeout * 1000);
                }
                else reject('socket error or timeout');
            } else {
                socket.send(request)
            }
        });
    }

    async function play(input) {
        const url = await toStream(input);
        let play_resolve = function () { };
        ttsAudio.src = url;
        ttsAudio.onended = (e) => {
            addLoading(false);
            play_resolve(true);
        }
        await ttsAudio.play();
        return new Promise((resolve, reject) => {
            play_resolve = resolve
        });
    }

    return new Promise((resolve, reject) => {
        setTimeout(_ => reject('socket open timeout'), timeout * 1000);
        // Connection opened
        socket.addEventListener('open', function (event) {
            resolve({
                play,
                toStream,
                setVoice: (voice, locale) => {
                    _voice = voice;
                    if (!locale) {
                        const voiceLangMatch = VOICE_LANG_REGEX.exec(_voice);
                        if (!voiceLangMatch) {
                            throw new Error("Could not infer voiceLocale from voiceName!");
                        }
                        _voiceLocale = voiceLangMatch[0];
                    } else {
                        _voiceLocale = locale;
                    }
                },
                setFormat,
                isReady: _ => ready
            })
        });
    });
}

function addLoading(add) {
    let speakBtn = document.querySelector("#hanzi-popup-tts-btn > button");
    if (speakBtn) {
        if (add) {
            speakBtn.classList.remove("tts");
            speakBtn.classList.add("tts-loading");
        } else {
            speakBtn.classList.add("tts");
            speakBtn.classList.remove("tts-loading");
        }
    }
}

function ttsPostMessage(ttsText, voice) {
    if (!ttsWindow || ttsWindow.closed) {
        ttsWindow = window.open(`${host}/tts.html`);
    } else {
        ttsWindow.postMessage({ message: "ttsPlay", text: ttsText, voice: voice }, "*");
    }
}

async function edgeTtsPlay(text, voice = "zh-CN-XiaoxiaoNeural") {
    if (text === undefined || text === null || text === '') {
        return;
    }

    addLoading(true);

    if (ttsError) {
        ttsPostMessage(text, voice);
        addLoading(false);
        return;
    }

    ttsText = text;
    const tts = await create_edge_TTS({ voice });

    try {
        await tts.play(text);
    } catch (e) {
        ttsError = true;
        console.log(e);
        addLoading(false);
        // again 
        edgeTtsPlay(text);
    }
}

window.addEventListener("message", function (event) {
    if (event.data.message === "ttsResult") {
        if (!event.data.result) {
            if (confirm("TTS failed. Open Hanzipopup TTS page again?")) {
                if (ttsWindow) {
                    ttsWindow.focus();
                }
            }
        }
    }
});

function enableAutoTTS() {
    if (typeof window === 'undefined') {
        return;
    }
    const isiOS = navigator.userAgent.match(/ipad|iphone/i);
    if (!isiOS) {
        return;
    }
    const simulateSpeech = () => {
        const lecture = new SpeechSynthesisUtterance('hello');
        lecture.volume = 0;
        speechSynthesis.speak(lecture);
        document.removeEventListener('click', simulateSpeech);
    };

    document.addEventListener('click', simulateSpeech);
}

enableAutoTTS();
