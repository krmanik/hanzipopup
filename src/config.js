// https://github.com/krmanik/hanzipopup
let defaultConfig = {
    popupColor: 'yellow',
    fontSize: 'small',
    zhuyin: false,
    grammar: true,
    vocab: true,
    simpTrad: 'classic',
    toneColorScheme: 'standard',
    enable: false,
    tts: false,
    prev: false,
    next: false,
    more: false,
    cnTtsEngine: 'browser',
    ttsvoice: "zh-CN-XiaoxiaoNeural",
}

async function setConfig(key, value) {
    let config = await GM.getValue('config', JSON.stringify(defaultConfig));
    config = JSON.parse(config);
    config[key] = value;
    let jsonStr = JSON.stringify(config);
    return await GM.setValue('config', jsonStr);
}

async function getConfig() {
    let config = await GM.getValue('config', null);
    if (config === null) {
        config = JSON.stringify(defaultConfig);
        await GM.setValue('config', config);
        return defaultConfig;
    }
    config = JSON.parse(config);
    return config
}
