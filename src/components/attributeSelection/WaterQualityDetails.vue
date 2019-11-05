<template>
  <div>
    <OptionsSelection :header="$t('$waterQualityDetailsHeader')" :module="module" :twoColumns="true"/>
    <DepthSelection />
  </div>
</template>

<script src="./waterQualityDetails.ts"/>