<template>
  <div>
    <SelectionHeader :header="$t('$fileDownloadTitle')" />
    <button
      :disabled="isDownloading"
      class="download-button"
      @click="downloadData"
    >
      {{ $t('$fetch') }}
    </button>
  </div>
</template>

<script src="./dataDownload.ts"></script>
