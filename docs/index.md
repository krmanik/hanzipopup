# Hanzipopup

Popup Dictionary for Chinese Language<br>
Port of [zhongwen](https://github.com/cschiller/zhongwen) browser extension as UserScript for Android and iOS.

## Description

A UserScript for browsers to show meaning in popup for selected Chinese characters. The UserScript uses [zhongwen](https://github.com/cschiller/zhongwen) browser extension codes.

## Highlights
- Supports both traditional and simplified characters.
- Natural Text to Speech for selected Chinese characters.
- Includes a recent version of the widely used CEDICT Chinese English dictionary.
- Displays Hanyu Pinyin along both the simplified and traditional characters, however only showing either simplified or traditional characters can be configured as an option.
- As a learning aid it uses different colors for displaying the Pinyin syllables, depending on the tone of the Chinese character.
- Can be turned on and off with a single mouse-click.
- Highlights the characters whose translation is displayed in the pop-up window.
- Also supports keyboard navigation for translating the next character, the next word, or the previous character.
- Allows you to add words to a built-in word list. Words from this list can be exported to a text file for further processing, such as importing the words into Anki.
- Includes links to grammar and usage notes on the Chinese Grammar Wiki.

## Install

> Note: Read installation instruction here. [https://greasyfork.org](https://greasyfork.org)

### Android

Install [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/), [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/), or [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/) for Firefox.

### iOS

Install [UserScript manager](https://itunes.apple.com/us/app/userscripts/id1463298887) for Safari browser.

## Usage

1. Open browser and enable extension

2. Download and install Hanzipopup UserScript

    - Download from GitHub
    > [hanzipopup.user.js](https://github.com/krmanik/hanzipopup)

    - Download from Greasy Fork
    > [hanzipopup.user.js](https://greasyfork.org/en/scripts/485928-hanzipopup-popup-dictionary-for-chinese-language)

3. Open extension and enable the UserScript

4. Enable Hanzipopup and click on Chinese characters to view definitions

> Note: For Chrome and Firefox, use official [Zhongwen](https://github.com/cschiller/zhongwen) extension.

## Source

> [Source Code](https://github.com/krmanik/hanzipopup)


## Images

<div style="display: flex;">
    <img height="450px" src="https://krmanik.github.io/hanzipopup/images/android.jpg">
    <img height="450px" src="https://krmanik.github.io/hanzipopup/images/ios.png">
    <img height="450px" src="https://krmanik.github.io/hanzipopup/images/options.png">
    <img height="450px" src="https://krmanik.github.io/hanzipopup/images/save.png">
</div>

## Technical Details 

- [`window.open`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open)

The API used to open word list and tts page. The word list store the saved words in local storage and can be used to edit the list and export as file.

- [`window.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

The API used communicate between current page and word list or tts page. In case of word list page, words data sent from current page to word list page and stored in local storage. In case of tts, selected Chinese text sent from current page to tts page. 

- [`@require`]

The meta used for getting [unzipit](https://cdn.jsdelivr.net/npm/unzipit/dist/unzipit.min.js) library for extracting compressed cedict_ts.zip file.

- [`GM_xmlhttpRequest`]

The meta used for getting zhongwen dictionary data.

## Experimental Feature

#### Text to speech for selected Chinese characters

- To fix following error, a new window with [tts.html](https://krmanik.github.io/hanzipopup/tts.html) opened and tts played in that window.
```
Refused to connect to 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=
```

- To fix following error, in opened [tts.html](https://krmanik.github.io/hanzipopup/tts.html) page, a toggle button added to make sure, user should interact to the tts page before using tts in opener page.
```
Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first.
```

After tts page opened, go back to opener page click once tts icon, again come back to opener pager.

## Issues

For issues and help,<br>[https://github.com/krmanik/hanzipopup/issues](https://github.com/krmanik/hanzipopup/issues)

## License
- krmanik
- GPL-2.0 Copyright (C) 2024
- Read more [License](https://krmanik.github.io/hanzipopup/license)
