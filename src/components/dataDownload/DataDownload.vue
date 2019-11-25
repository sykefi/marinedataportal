<template>
  <div>
    <SelectionHeader :header="$t('$fileDownloadTitle')" />
    <button
      class="download-button"
      @click="downloadData"
      :aria-expanded="errorList.length > 0"
    >{{$t('$fetch')}}</button>
    <fieldset class="error-content">
      <li v-for="error in errorList" :key="error" class="error">{{$t(error)}}</li>
    </fieldset>
  </div>
</template>

<style lang="scss">
  @import "@/assets/styles/variables.scss";
  .error-content {
    border: none;
    text-align: left;
    margin: 1rem 7rem 0 7rem;
  }
</style>

<script src="./dataDownload.ts"></script>
