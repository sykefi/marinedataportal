<template>
  <div>
    <SelectionHeader :header="$t('$fileDownloadTitle')" />
    <button
      class="download-button"
      @click="downloadData"
    >{{$t('$fetch')}}</button>
  </div>
</template>

<script src="./dataDownload.ts"></script>
