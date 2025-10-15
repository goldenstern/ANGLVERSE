<template>
<div class="app-root">
  <div id="app">
      <router-view/>
  </div>
  <div class="pc-screen" v-if="!phone" style="background: #472D7E;">
      <div class="a">
          <img src="./assets/pc-1.png" width="200" height="200" style="width: 950px;height: auto;top: 0;">
          <!--
          <img src="./assets/pc-2.png" width="200" height="200" style="margin-top: -10px;z-index: 3;width: 200px;position: absolute;height: auto;top: 50%;">
          -->
          <div class="qr-wrapper">
            <div style="z-index: 1;padding: 20px;background: white;border-radius: 20px;">
              <!-- <a href="https://unicorn.angl.app">https://unicorn.angl.app</a> -->
              <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
            </div>
          </div>
          <!-- <img src="./assets/grcode.svg" width="200" height="200" alt="angl.app"> -->
      </div>
      <img src="./assets/pc-3.svg" width="200" height="200" style="width: 100%;position: fixed;height: auto;bottom: 0;">
  </div>
  <div class="black-screen" v-else>
      <img src="./assets/vertik.png" class="black-screen-image">
  </div>
</div>
</template>

<script>
// Здесь JS
import axios from 'axios'
import state from './store/state'
import WebsocketClient from './wsclient'
import QrcodeVue from 'qrcode.vue'
import utils from './utils'
import config from './config'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default {
  data: () => ({
    state,
    phone: true,
    // value: "https://angl.app",
    size: 250
  }),
  components: {
    "qrcode-vue": QrcodeVue,
  },
  methods: {
    onGameEndedWSEvent (evt) {
      console.log('Game has ended')
      console.debug('game_ended event data', evt)
    },
    onTransactionUpdateWSEvent (evt) {
      console.log('Transaction update')
      console.debug('Transaction update event data', evt)
      axios.get(config.api+'/wallet').then(()=>{
        utils.update_user(true);
      })
    },
    getPhone () {
      const devices = new RegExp('Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini', "i");
      if (devices.test(navigator.userAgent))
      {
        this.phone = true;
      }
      else
      {
        this.phone = false;
      }
    }
  },
  computed: {
     value () {
      const url = document.location.href
      //if (url.includes('/register/ref/'))
        return url;
      //return 'https://angl.app'
    }
  },
  mounted () {
    this.getPhone();
    WebsocketClient.addHandler('game_ended', this.onGameEndedWSEvent);
    WebsocketClient.addHandler('transaction_update', this.onTransactionUpdateWSEvent);
  }
}
</script>

<style>
#app {
  font-family: Arimo;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
}

.black-screen {
  display: none;
}

body {
  background-color: white!important;
  overscroll-behavior-y:  none;
}

*:focus {
    outline: none;
}

hr {
  background: none!important;
  border: none!important;
}

/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Render the `main` element consistently in IE.
 */

main {
  display: block;
}

/**
 * Correct the font size and margin on `h1` elements within `section` and
 * `article` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent `sub` and `sup` elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

.qr-wrapper {
  flex-grow: 3;
  z-index: 1000;
  margin-top: -150px;
  padding-bottom:  150px
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select { /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from `fieldset` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    `fieldset` elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to `inherit` in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}

@media screen and (min-device-aspect-ratio:1/1) and (orientation: landscape) {
  #app {
    display:none;
  }

  html, body, .black-screen, .pc-screen, .app-root {
    width: 100%;
    height: 100%;
  }

  .black-screen, .pc-screen {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: auto;
    min-height: 100%;
  }

  .black-screen-image {
    width: auto;
    height: 100%;
  }

  .pc-screen .a {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .pc-screen a {
    color: white;
    padding: 0.5rem;
  }

}

</style>

<style scoped>
  html {
    background: rgb(71, 45, 126);
  }
</style>