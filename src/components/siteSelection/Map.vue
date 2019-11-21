<template>
  <div>
    <p>{{ $t("$mapInformation") }}</p>
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      @created="mapCreated"
      style="height: 40rem"
    >
      <vl-view :center="mapCenter" :zoom="mapZoom"></vl-view>

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>

      <vl-layer-vector>
        <vl-source-vector :features="availableFeatures" ref="vectorSource" />
      </vl-layer-vector>
      <vl-interaction-select
        ref="selectInteraction"
        :features.sync="selectedFeatures"
      ></vl-interaction-select>
    </vl-map>
  </div>
</template>

<script src="./map.ts"></script>
