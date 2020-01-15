<template>
  <div id="app">
    <Header />
    <AttributeSelection />
    <TimeSpanSelection />
    <SiteSelection />
    <DataDownload />
    <DataPreview />
    <Footer />
    <div id="busy-indicator" v-if="loading">
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
      {{ $t("$busy") }}
    </div>
    <div v-if="hasError" class="error-notification">
      {{ $t("$errorNotification") }}
    </div>
  </div>
</template>

<script src="./app.ts" />

<style lang="scss">
//global styles
@import "@/assets/styles/font_faces.scss";
@import "@/assets/styles/variables.scss";
#app * {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  font-family: "TitilliumWeb", sans-serif;
  text-align: center;
  max-width: 65rem;
  margin-left: auto;
  margin-right: auto;
}

.hidden {
  display: none;
}

#busy-indicator {
  position: fixed;
  bottom: 10%;
  left: 0;
  right: 0;
  margin: 0 auto;
  line-height: 3rem;
  width: 12rem;
  border: 0.08rem solid $border-dark;
  border-radius: 1.2rem;
  text-align: center;
  color: $border-dark;
  background: white;
  z-index: 999;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  position: relative;
  vertical-align: middle;
  display: inline-block;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: $background-blue;
  opacity: 0.7;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
