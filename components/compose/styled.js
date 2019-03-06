import styled from 'styled-components';

const StylesWrapper = styled.div`
  .draftJsMentionPlugin__mention__29BEd,
  .draftJsMentionPlugin__mention__29BEd:visited {
    color: #575f67;
    cursor: pointer;
    display: inline-block;
    background: #e6f3ff;
    padding-left: 2px;
    padding-right: 2px;
    border-radius: 2px;
    text-decoration: none;
  }

  .draftJsMentionPlugin__mention__29BEd:hover,
  .draftJsMentionPlugin__mention__29BEd:focus {
    color: #677584;
    background: #edf5fd;
    outline: 0; /* reset for :focus */
  }

  .draftJsMentionPlugin__mention__29BEd:active {
    color: #222;
    background: #455261;
  }
  .draftJsMentionPlugin__mentionSuggestionsEntry__3mSwm {
    padding: 7px 10px 3px 10px;
    transition: background-color 0.4s cubic-bezier(0.27, 1.27, 0.48, 0.56);
  }

  .draftJsMentionPlugin__mentionSuggestionsEntry__3mSwm:active {
    background-color: #cce7ff;
  }

  .draftJsMentionPlugin__mentionSuggestionsEntryFocused__3LcTd {
    background-color: #e6f3ff;
  }

  .draftJsMentionPlugin__mentionSuggestionsEntryText__3Jobq {
    display: inline-block;
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 368px;
    font-size: 0.9em;
    margin-bottom: 0.2em;
  }

  .draftJsMentionPlugin__mentionSuggestionsEntryAvatar__1xgA9 {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 12px;
  }
  .draftJsMentionPlugin__mentionSuggestions__2DWjA {
    max-height: 200px;
    overflow: auto;
    border: 1px solid #eee;
    margin-top: 0.4em;
    position: absolute;
    min-width: 220px;
    max-width: 440px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0px 4px 30px 0px rgba(220, 220, 220, 1);
    cursor: pointer;
    padding-top: 8px;
    padding-bottom: 8px;
    z-index: 2;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    box-sizing: border-box;
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  .editor {
    box-sizing: border-box;
    cursor: text;
    padding: 0;
    padding-right: 25px;
    * {
      hyphens: auto;
      word-break: break-word;
    }
  }

  .editor :global(.public-DraftEditor-content) {
    min-height: 140px;
  }

  .draftJsEmojiPlugin__emojiSelect__34S1B {
    display: inline-block;
  }

  .draftJsEmojiPlugin__emojiSelectButton__3sPol,
  .draftJsEmojiPlugin__emojiSelectButtonPressed__2Tezu {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    line-height: 1.2em;
    font-size: 1.5em;
    color: #888;
    background: #fff;
    border: 0;
    border-radius: 1.5em;
    cursor: pointer;
  }

  .draftJsEmojiPlugin__emojiSelectButton__3sPol:focus,
  .draftJsEmojiPlugin__emojiSelectButtonPressed__2Tezu:focus {
    outline: 0;
    /* reset for :focus */
  }

  .draftJsEmojiPlugin__emojiSelectButton__3sPol:hover,
  .draftJsEmojiPlugin__emojiSelectButtonPressed__2Tezu:hover {
    background: white;
  }

  .draftJsEmojiPlugin__emojiSelectButton__3sPol:active,
  .draftJsEmojiPlugin__emojiSelectButtonPressed__2Tezu:active {
    background: white;
  }

  .draftJsEmojiPlugin__emojiSelectButtonPressed__2Tezu {
    background: white;
  }

  .draftJsEmojiPlugin__emojiSelectPopover__1J1s0 {
    margin-top: 10px;
    padding: 0 0.3em;
    position: absolute;
    z-index: 1000;
    right: 0;
    box-sizing: content-box;
    background: #fff;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 30px 0 gainsboro;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverClosed__3Kxxq {
    display: none;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverTitle__3tpXz {
    margin: 0 0 0.3em;
    padding-left: 1em;
    height: 2.5em;
    line-height: 2.5em;
    font-weight: normal;
    font-size: 1em;
    color: #9e9e9e;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverGroups__35t9m {
    margin: 0 0 0.3em;
    position: relative;
    z-index: 0;
    width: 21em;
    height: 20em;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverGroup__3zwcE {
    padding: 0 0.5em;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverGroup__3zwcE:first-child
    .draftJsEmojiPlugin__emojiSelectPopoverGroupTitle__2pC51 {
    display: none;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverGroupTitle__2pC51 {
    margin: 1em 0;
    padding-left: 0.5em;
    font-weight: normal;
    font-size: 1em;
    color: #9e9e9e;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverGroupList__HQ8_y {
    margin: 0;
    padding: 0;
    display: -webkit-box;
    display: flex;
    list-style: none;
    flex-wrap: wrap;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverGroupItem__2pFOS {
    width: 2.5em;
    height: 2.5em;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverToneSelect__28bny {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverToneSelectList__haFSJ {
    margin: 0.3em;
    padding: 0.3em;
    position: absolute;
    display: -webkit-box;
    display: flex;
    list-style: none;
    border: 1px solid #e0e0e0;
    border-radius: 0.5em;
    background: #fff;
    box-shadow: 0 0 0.3em rgba(0, 0, 0, 0.1);
  }

  .draftJsEmojiPlugin__emojiSelectPopoverToneSelectItem__2SgvL {
    width: 2.5em;
    height: 2.5em;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverToneSelectItem__2SgvL:first-child {
    border-right: 1px solid #e0e0e0;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverEntry__1ErDJ,
  .draftJsEmojiPlugin__emojiSelectPopoverEntryFocused__M28XS {
    padding: 0;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    outline: none;
    transition: background-color 0.4s cubic-bezier(0.27, 1.27, 0.48, 0.56);
  }

  .draftJsEmojiPlugin__emojiSelectPopoverEntryFocused__M28XS {
    background-color: #efefef;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverEntryIcon__1yNaC {
    width: 1.5em;
    height: 1.5em;
    vertical-align: middle;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverNav__1Nzd7 {
    margin: 0;
    padding: 0 0.5em;
    display: -webkit-box;
    display: flex;
    width: 20em;
    list-style: none;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverNavItem__qydCX {
    width: 2.5em;
    height: 2.5em;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverNavEntry__1OiGB,
  .draftJsEmojiPlugin__emojiSelectPopoverNavEntryActive__2j-Vk {
    padding: 0;
    width: 100%;
    height: 100%;
    font-size: 1.2em;
    color: #bdbdbd;
    background: none;
    border: none;
    outline: none;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverNavEntryActive__2j-Vk {
    color: #42a5f5;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverScrollbar__1Xjc6 {
    position: absolute;
    right: 0;
    top: 0.3em;
    bottom: 0.3em;
    width: 0.25em;
    background-color: #e0e0e0;
    border-radius: 0.125em;
    opacity: 0.1;
    transition: opacity 0.4s;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverScrollbarThumb__jGYdG {
    background-color: #000;
    border-radius: 0.125em;
    cursor: pointer;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverGroups__35t9m:hover .draftJsEmojiPlugin__emojiSelectPopoverScrollbar__1Xjc6 {
    opacity: 0.3;
  }

  .draftJsEmojiPlugin__emojiSelectPopoverGroups__35t9m .draftJsEmojiPlugin__emojiSelectPopoverScrollbar__1Xjc6:hover,
  .draftJsEmojiPlugin__emojiSelectPopoverGroups__35t9m .draftJsEmojiPlugin__emojiSelectPopoverScrollbar__1Xjc6:active {
    opacity: 0.6;
  }
  .draftJsEmojiPlugin__emoji__2oqBk {
    background-position: center;
    /* make sure the background the image is only shown once */
    background-repeat: no-repeat;
    background-size: contain;
    /* move it a bit further down to align it nicer with the text */
    vertical-align: middle;

    /*
  We need to limit the emoji width because it can be multiple characters
  long if it is a 32bit unicode. Since the proper width depends on the font and
  it's relationship between 0 and other characters it's not ideal. 1.95ch is not
  the best value, but hopefully a good enough approximation for most fonts.
  */
    display: inline-block;
    overflow: hidden;
    max-width: 1.95ch;
    /*
  Needed for iOS rendering to avoid some icons using a lot of height without
  actually needing it.
  */
    max-height: 1em;
    line-height: inherit;
    margin: -0.2ex 0em 0.2ex;
    /*
  In the past we used opacity: 0 to hide the original Emoji icon no matter what
  system it is. Recently we switched to color: transparent since it started to
  work in recent iOS version.
  */
    color: transparent;

    /*
  Some SVG files (say 2764 for :heart:) don't have default width/height, thus
  may not be rendered properly on some platforms/browsers (e.g., Windows 10 +
  Chrome 61).
  */
    min-width: 1em;
  }
  .draftJsEmojiPlugin__emojiSuggestionsEntry__2-2p_ {
    padding: 5px 10px 1px 10px;
    transition: background-color 0.4s cubic-bezier(0.27, 1.27, 0.48, 0.56);
  }

  .draftJsEmojiPlugin__emojiSuggestionsEntry__2-2p_:active {
    background-color: #cce7ff;
  }

  .draftJsEmojiPlugin__emojiSuggestionsEntryFocused__XDntY {
    background-color: #e6f3ff;
  }

  .draftJsEmojiPlugin__emojiSuggestionsEntryText__2sPjk {
    display: inline-block;
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 368px;
    font-size: 0.9em;
  }

  .draftJsEmojiPlugin__emojiSuggestionsEntryIcon__1qC2V {
    width: 1em;
    height: 1em;
    margin-left: 0.25em;
    margin-right: 0.25em;
    display: inline-block;
  }
  .draftJsEmojiPlugin__emojiSuggestions__2ffcV {
    border: 1px solid #eee;
    margin-top: 1.75em;
    position: absolute;
    min-width: 220px;
    max-width: 440px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0px 4px 30px 0px rgba(220, 220, 220, 1);
    cursor: pointer;
    padding-top: 8px;
    padding-bottom: 8px;
    z-index: 2;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    box-sizing: border-box;
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  .public-DraftEditorPlaceholder-inner {
    position: absolute;
    color: #aaaaaa;
    user-select: none;
  }
`;

export default StylesWrapper;
