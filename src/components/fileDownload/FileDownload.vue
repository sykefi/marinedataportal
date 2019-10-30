<template>
  <div>
    <SelectionHeader :header="$t('$fileDownloadTitle')" />
    <button
      class="download-button"
      @click="downloadData"
      :aria-expanded="errorList.length > 0"
    >{{$t('$download')}}</button>
    <fieldset class="error-content">
      <li v-for="error in errorList" :key="error" class="error">{{$t(error)}}</li>
    </fieldset>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables.scss";
.download-button {
  font-family: "TitilliumWeb";
  font-weight: bold;
  font-size: $font-size-l;
  color: $text-white;
  padding: 0 2rem 0 2rem;
  height: 3.5rem;
  background: $background-blue;
  box-shadow: 0 0.2rem 0 $border-shadow;
  border-radius: 5px;
  &:not(:disabled):hover {
    background: $background-blue-hover;
  }
}
.error-content {
  border: none;
  text-align: left;
  margin: 1rem 7rem 0 7rem;
}
</style>

<script src="./fileDownload.ts"></script>
