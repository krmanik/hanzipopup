// https://github.com/cschiller/zhongwen
// https://github.com/krmanik/hanzipopup
let style = `
.unselectable {
  -khtml-user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
#custom-popup-container {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.8) 0px 0px 200px 28px;
  z-index: 99999999999;
  width: 90%;
  height: 400px;
}
#custom-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 8px 8px 8px 18px;
}
.custom-popup-label {
  display: flex;
  margin-bottom: 2px;
  font-weight: bold;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  width: 95%;
  padding-bottom: 4px;
  place-items: center;
  align-items: center;
}
#custom-popup-container a {
  text-decoration: none;
  color: #2196F3;
}
#custom-popup-container input[type=checkbox],
input[type=radio] {
  accent-color: #2196F3;
}
#zhongwenPopupContainer {
  height: 348px;
  overflow-y: scroll;
  margin-left: 20px;
  margin-bottom: 60px;
}
#zhongwenPopupContainer::-webkit-scrollbar {
  width: 6px;
}
#zhongwenPopupContainer::-webkit-scrollbar-track {
  background: #fff;
}
#zhongwenPopupContainer::-webkit-scrollbar-thumb {
  background: #4CAF50;
  border-radius: 20px;
}
#zhongwenPopupContainer::-webkit-scrollbar-thumb:hover {
  background: #555;
}
@media (prefers-color-scheme: dark) {
  #custom-popup-container {
      background-color: #2f2f2f !important;
      color: #fff;
  }
  #zhongwenPopupContainer {
      select {
        color: #fff;
        background-color: #2f2f2f !important;
        margin: 0;
      }
  }
  #zhongwenPopupContainer::-webkit-scrollbar-track {
    background: #2f2f2f;
  }
}
/* Generic Styles */
#zhongwen-window,
#zhongwen-window * {
  width: auto;
  height: auto;
  background: transparent;
  border: none !important;
  margin: 0px;
  padding: 0px;
  letter-spacing: normal;
  text-align: left;
  text-decoration: none;
  text-indent: 0px;
  text-transform: none;
  white-space: normal;
  word-spacing: normal;
  font-weight: normal;
  font-size: 12px;
  font-family: Tahoma, Geneva, sans-serif;
  visibility: visible;
  line-height: initial;
}
#zhongwen-window {
  position: absolute;
  z-index: 99999999;
  border: 1px solid #d0d0d0 !important;
  padding: 4px;
  background: #e6f4ff;
  top: 5px;
  left: 5px;
  min-width: 100px;
  border-radius: 5px;
  box-shadow: 10px 10px 5px -5px #999999;
}
#zhongwen-window .w-hanzi {
  font-size: 32px;
  margin-right: 0.7em;
}
#zhongwen-window .w-pinyin {
  font-size: 18px;
}
#zhongwen-window .w-def {
  font-size: 16px;
}
#zhongwen-window .w-zhuyin {
  font-family: PMingLiU, 'Apple LiGothic', sans-serif;
  font-size: 16px;
}
#zhongwen-window .w-hanzi-small {
  font-size: 18px;
  margin-right: 0.7em;
}
#zhongwen-window .w-pinyin-small {
  font-size: 16px;
}
#zhongwen-window .w-def-small {
  font-size: 12px;
}
#zhongwen-window .w-zhuyin-small {
  font-family: PMingLiU, 'Apple LiGothic', sans-serif;
  font-size: 12px;
}
#zhongwen-window .grammar {
  font-weight: bold;
}
#zhongwen-window .vocab {
  font-weight: bold;
}
/* Yellow Background */
#zhongwen-window.background-yellow,
#zhongwen-window.background-yellow * {
  color: #000000;
  background: #ffffbf;
}
#zhongwen-window.background-yellow .w-hanzi,
#zhongwen-window.background-yellow .w-hanzi-small {
  color: #7070e0;
}
#zhongwen-window.background-yellow .grammar {
  color: #00008b;
}
#zhongwen-window.background-yellow .vocab {
  color: #00008b;
}
/* Lightblue Background */
#zhongwen-window.background-lightblue,
#zhongwen-window.background-lightblue * {
  color: #000000;
  background: #e6f4ff;
}
#zhongwen-window.background-lightblue .w-hanzi,
#zhongwen-window.background-lightblue .w-hanzi-small {
  color: #3082bf;
}
#zhongwen-window.background-lightblue .w-pinyin,
#zhongwen-window.background-lightblue .w-pinyin-small {
  color: #00b366;
}
#zhongwen-window.background-lightblue .grammar {
  color: #00008b;
}
#zhongwen-window.background-lightblue .vocab {
  color: #00008b;
}
/* Blue Background */
#zhongwen-window.background-blue,
#zhongwen-window.background-blue * {
  color: #ffffff;
  background: #5c73b8;
}
#zhongwen-window.background-blue .w-hanzi,
#zhongwen-window.background-blue .w-hanzi-small {
  color: #b7e7ff;
}
#zhongwen-window.background-blue .w-pinyin,
#zhongwen-window.background-blue .w-pinyin-small {
  color: #c0ffc0;
}
#zhongwen-window.background-blue .grammar {
  color: #add8e6;
}
#zhongwen-window.background-blue .vocab {
  color: #add8e6;
}
/* Black Background */
#zhongwen-window.background-black,
#zhongwen-window.background-black * {
  color: #ffffff;
  background: #000000;
}
#zhongwen-window.background-black .w-hanzi,
#zhongwen-window.background-black .w-hanzi-small {
  color: #7070e0;
}
#zhongwen-window.background-black .w-pinyin,
#zhongwen-window.background-black .w-pinyin-small {
  color: #20a020;
}
#zhongwen-window.background-black .grammar {
  color: #add8e6;
}
#zhongwen-window.background-black .vocab {
  color: #add8e6;
}
/* Standard Tone Colors */
#zhongwen-window.tonecolor-standard .tone1 {
  color: #ee363e;
}
#zhongwen-window.tonecolor-standard .tone2 {
  color: #f47c36;
}
#zhongwen-window.tonecolor-standard .tone3 {
  color: #73bb4f;
}
#zhongwen-window.tonecolor-standard .tone4 {
  color: #649cd3;
}
#zhongwen-window.tonecolor-standard .tone5 {
  color: #a0a0a0;
}
/* Pleco Tone Colors */
#zhongwen-window.tonecolor-pleco .tone1 {
  color: #e30000;
}
#zhongwen-window.tonecolor-pleco .tone2 {
  color: #02b31c;
}
#zhongwen-window.tonecolor-pleco .tone3 {
  color: #1510f0;
}
#zhongwen-window.tonecolor-pleco .tone4 {
  color: #8900bf;
}
#zhongwen-window.tonecolor-pleco .tone5 {
  color: #777777;
}
/* Hanping Tone Colors */
#zhongwen-window.tonecolor-hanping .tone1 {
  color: #64b4ff;
}
#zhongwen-window.tonecolor-hanping .tone2 {
  color: #30b030;
}
#zhongwen-window.tonecolor-hanping .tone3 {
  color: #f08000;
}
#zhongwen-window.tonecolor-hanping .tone4 {
  color: #d00020;
}
#zhongwen-window.tonecolor-hanping .tone5 {
  color: #a0a0a0;
}
#hanzipopup-fab-container,
#custom-popup-container {
  .info-button {
    background: #828282;
    padding: 8px;
    margin: 1px;
    border-radius: 8px;
    color: white;
    text-align: center;
    cursor: pointer;
    border: none;
  }
  #zhongwen-info-buttons {
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 64px;
    padding: 4px;
    z-index: 9999999999;
  }
  .option-div {
    margin: 4px 0px 4px 2px;
  }
  .h-icon-btn {
    width: 36px;
    height: 36px;
    position: relative;
    border: none;
    border-radius: 10%;
    cursor: pointer;
    outline: none;
    top: unset;
    left: unset;
    right: unset;
    bottom: unset;
  }
  .h-icon-btn:before {
    content: "";
    position: absolute;
    left: 6px;
    top: 0;
    bottom: 0;
    width: 24px;
  }
  .init {
    border-radius: 2px;
    display: inline-flex;
    width: 24px !important;
    height: 24px !important;
    cursor: pointer;
  }
  .init:before {
    left: 0px !important;
    position: absolute;
  }
  .hero:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .enable:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .disable:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .option:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .save:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .view:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M360-240h440v-107H360v107ZM160-613h120v-107H160v107Zm0 187h120v-107H160v107Zm0 186h120v-107H160v107Zm200-186h440v-107H360v107Zm0-187h440v-107H360v107ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .show:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M500-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .hide:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M460-320v-320L300-480l160 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm440-80h120v-560H640v560Zm-80 0v-560H200v560h360Zm80 0h120-120Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .tts:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h360l-80 80H160v640h440v-120h80v120q0 33-23.5 56.5T600-80H160Zm80-160v-80h280v80H240Zm0-120v-80h200v80H240Zm360 0L440-520H320v-200h120l160-160v520Zm80-122v-276q36 21 58 57t22 81q0 45-22 81t-58 57Zm0 172v-84q70-25 115-86.5T840-620q0-78-45-139.5T680-846v-84q104 27 172 112.5T920-620q0 112-68 197.5T680-310Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .prev:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M440-760v-80h80v80h-80Zm0 640v-80h80v80h-80ZM280-760v-80h80v80h-80Zm0 640v-80h80v80h-80ZM120-760v-80h80v80h-80Zm0 640v-80h80v80h-80Zm480 0v-80h80v-560h-80v-80h240v80h-80v560h80v80H600ZM280-320 120-480l160-160 56 56-63 64h287v80H273l63 64-56 56Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .next:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M440-120v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80ZM120-120v-80h80v-560h-80v-80h240v80h-80v560h80v80H120Zm560-200-56-56 63-64H400v-80h287l-63-64 56-56 160 160-160 160Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .up:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M240-400v-480h480v480H240Zm80-80h320v-320H320v320Zm320 240v-80h80v80h-80Zm-400 0v-80h80v80h-80ZM640-80v-80h80v80h-80Zm-200 0v-80h80v80h-80Zm-200 0v-80h80v80h-80Zm240-560Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .down:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M240-80v-480h480v480H240Zm80-80h320v-320H320v320Zm-80-480v-80h80v80h-80Zm400 0v-80h80v80h-80ZM240-800v-80h80v80h-80Zm200 0v-80h80v80h-80Zm200 0v-80h80v80h-80ZM480-320Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .copy:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M120-220v-80h80v80h-80Zm0-140v-80h80v80h-80Zm0-140v-80h80v80h-80ZM260-80v-80h80v80h-80Zm100-160q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480Zm40 240v-80h80v80h-80Zm-200 0q-33 0-56.5-23.5T120-160h80v80Zm340 0v-80h80q0 33-23.5 56.5T540-80ZM120-640q0-33 23.5-56.5T200-720v80h-80Zm420 80Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .alt:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Zm280-40h320v-240H440v240Zm80-80v-80h160v80H520Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .more-info:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m357-384 123-123 123 123 57-56-180-180-180 180 57 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .popup:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm80-280v-80h400v80H280Zm0 160v-80h240v80H280Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .pinyin:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M340-468h56v-82h-56v82ZM101-260l-17-45h39q5 0 9.5-3.5t4.5-8.5v-101l-52 17-11-44 63-19v-90H81v-42h56v-92h44v92h45v42h-46v77l40-13 6 42-46 16v125q0 18-10.5 32.5T142-260h-41Zm139 6-29-32q35-23 57.5-59t23.5-79h-68v-45h72v-81h-54v-41h253v44h-57v83h70l-2 40h-68v165h-44v-165h-58q-2 52-27.5 96.5T240-254Zm193-327-41-10 22-48q11-24 19-49l45 16q-10 23-21.5 45.5T433-581Zm-121-2q-10-23-21-45t-25-42l40-17q14 20 25 42t21 45l-40 17Zm390 249q28 0 54.5-13t48.5-37v-106q-23 3-42.5 7t-36.5 9q-45 14-67.5 35T636-390q0 26 18 41t48 15Zm-23 68q-57 0-90-32.5T556-387q0-52 33-85t106-53q23-6 50.5-11t59.5-9q-2-47-22-68.5T721-635q-26 0-51.5 9.5T604-592l-32-56q33-25 77.5-40.5T740-704q71 0 108 44t37 128v257h-67l-6-45q-28 25-61.5 39.5T679-266Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .font:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M560-160v-520H360v-120h520v120H680v520H560Zm-360 0v-320H80v-120h360v120H320v320H200Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .translate:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .book:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M160-391h45l23-66h104l24 66h44l-97-258h-46l-97 258Zm81-103 38-107h2l38 107h-78Zm319-70v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-499Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .message:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M320-520q17 0 28.5-11.5T360-560q0-17-11.5-28.5T320-600q-17 0-28.5 11.5T280-560q0 17 11.5 28.5T320-520Zm160 0q17 0 28.5-11.5T520-560q0-17-11.5-28.5T480-600q-17 0-28.5 11.5T440-560q0 17 11.5 28.5T480-520Zm160 0q17 0 28.5-11.5T680-560q0-17-11.5-28.5T640-600q-17 0-28.5 11.5T600-560q0 17 11.5 28.5T640-520ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .zi:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M560-480h80v-120h-80v120ZM180-160l-20-80h60q8 0 14-6t6-14v-125q-17 7-33 13.5T176-360l-16-78q19-4 39.5-11t40.5-15v-136h-60v-80h60v-120h80v120h60v80h-60v96q15-9 29-18t27-18v80q-12 10-26 19.5T320-423v203q0 23-18.5 41.5T260-160h-80Zm222 0-44-66q42-28 72.5-75t42.5-99h-73v-80h80v-120h-60v-80h360v80h-60v120h80v80h-80v240h-80v-240h-86q-14 71-54.5 136.5T402-160Zm288-490-69-30q16-27 35.5-59t31.5-61l74 27q-15 29-35 62t-37 61Zm-189-8q-17-25-39-55t-42-53l72-34q18 23 38.5 52t37.5 53l-67 37Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .close:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
}
@keyframes tts-loading {
  to {
    transform: rotate(360deg);
  }
}
.tts-loading:before {
  content: '' !important;
  box-sizing: border-box !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  width: 20px !important;
  height: 20px !important;
  margin-top: -10px !important;
  margin-left: -10px !important;
  border-radius: 50% !important;
  border: 2px solid #fff !important;
  border-top-color: #ec440e !important;
  animation: tts-loading .6s linear infinite !important;
  -webkit-animation: tts-loading .6s linear infinite !important;
}
#hanzipopup-fab-container {
  position: fixed;
  transform: translate(-50%, -50%);
  bottom: 0px;
  right: 0px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  z-index: 9999999999;
  touch-action: none;
  .fab-btn {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      border-radius: 10%;
      background-color: #585e88;
      color: white;
      z-index: 1000;
      box-shadow: 0px 2px 18px -1px rgba(0, 0, 0, 0.3);
      outline: none;
      border: none;
      cursor: pointer;
  }
  ul {
    list-style: none;

    li {
      position: absolute;
      top: 0;
      left: 0;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      list-style-type: none;
      transition: .5s;
      border-radius: 10%;
      cursor: pointer;
      margin: 0 auto;
    }
  }
  &.fab-active {
      &.fab-active {
        :nth-child(1) { --nth-child: 1 }
        :nth-child(2) { --nth-child: 2 }
        :nth-child(3) { --nth-child: 3 }
        :nth-child(4) { --nth-child: 4 }
        :nth-child(5) { --nth-child: 5 }
        :nth-child(6) { --nth-child: 6 }
        :nth-child(7) { --nth-child: 7 }
        :nth-child(8) { --nth-child: 8 }
        li {
          top: 0;
        }
        &.left {
          li:nth-child(n+1) {
            left: calc(var(--nth-child) * 40px);
            transition-delay: calc(var(--nth-child) * 0.01s);
          }
        }
        &.right {
          li:nth-child(n+1) {
            left: calc(var(--nth-child) * -40px);
            transition-delay: calc(var(--nth-child) * 0.01s);
          }
        }
      }
    }
}
`;

GM.addStyle(style);
