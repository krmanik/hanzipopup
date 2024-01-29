// ==UserScript==
// @name            Hanzipopup - Popup Dictionary for Chinese Language
// @namespace       https://krmanik.github.io/hanzipopup/
// @version         0.0.1
// @description     A port of Zhongwen Chinese-English Pop-Up Dictionary as UserScript for Safari
// @homepageURL     https://krmanik.github.io/hanzipopup/
// @supportURL      https://github.com/krmanik/hanzipopup
// @icon            https://krmanik.github.io/hanzipopup/icon.png
// @match           *://*/*
// @exclude-match   *://*/*/wordlist.*
// @exclude-match   *://*/*/tts.*
// @inject-into     content
// @grant           GM.addStyle
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.xmlHttpRequest
// @license         GPL-2.0
// ==/UserScript==

/*
 Hanzipopup - A Chinese-English Pop-Up Dictionary UserScript
 Copyright (C) 2024 krmanik
 https://github.com/krmanik/hanzipopup
 
 ---
 
 Zhongwen - A Chinese-English Pop-Up Dictionary
 Copyright (C) 2010-2023 Christian Schiller
 https://chrome.google.com/extensions/detail/kkmlkkjojmombglmlpbpapmhcaljjkde

 ---

 Originally based on Rikaikun 0.8
 Copyright (C) 2010 Erek Speed
 http://code.google.com/p/rikaikun/

 ---

 Originally based on Rikaichan 1.07
 by Jonathan Zarate
 http://www.polarcloud.com/

 ---

 Originally based on RikaiXUL 0.4 by Todd Rudick
 http://www.rikai.com/
 http://rikaixul.mozdev.org/

 ---

 This program is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation; either version 2 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

 ---

 Please do not change or remove any of the copyrights or links to web pages
 when modifying any of the files.
 */

 'use strict';
