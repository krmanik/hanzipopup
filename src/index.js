/*
 Hanzipopup - A Chinese-English Pop-Up Dictionary UserScript
 Copyright (C) 2024 krmanik
 https://github.com/krmanik/hanzipopup
*/

async function setupHanzipopup() {
    await loadVals();
    await loadDict();

    let config = await getConfig();
    if (config["enable"]) {
        enable = true;
        document.querySelector("#hanzi-popup-enable-btn > button").style.background = "#33b249";
        enableTab();
    }
}

setupHanzipopup();
