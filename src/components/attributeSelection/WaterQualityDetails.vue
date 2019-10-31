<template>
  <div>
    <DetailsSelection :header="$t('$waterQualityDetailsHeader')" :attributes="attributes" />
    <DepthSelection :downloadClicked="downloadClicked" />
  </div>
</template>

<script src="./waterQualityDetails.ts"/>