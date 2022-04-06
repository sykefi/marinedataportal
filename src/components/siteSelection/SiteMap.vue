<template>
  <vl-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    @created="mapCreated"
    @pointermove="onMapPointerMove"
    ref="map"
    style="height: 40rem"
    :style="{ cursor: mapCursor }"
  >
    <vl-view
      :center="mapCenter"
      :zoom="mapZoom"
    />

    <vl-layer-tile
      ref="baseMapLayer"
      @mounted="baseMapLayerMounted"
    />
    <vl-layer-tile
      ref="cityNamesLayer"
      @mounted="cityNamesLayerMounted"
    />

    <vl-layer-vector ref="vectorLayer">
      <vl-source-vector
        :features="availableFeatures"
        ref="vectorSource"
      />
    </vl-layer-vector>
    <vl-interaction-select
      ref="selectInteraction"
      :features.sync="selectedFeatures"
    />

    <vl-overlay
      :offset="[10, -20]"
      v-if="currentHoverFeature"
      :position="currentHoverFeature.coordinates"
    >
      <template>
        <div
          class="map-hover"
          v-html="currentHoverFeature.name"
        />
      </template>
    </vl-overlay>
  </vl-map>
</template>

<script src="./siteMap.ts"></script>

<style lang="scss" scoped>
.map-hover {
  background: #fff;
  box-shadow: 2px 2px 10px #ccc;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  pointer-events: none;
  position: absolute;
  min-width: 10rem;
}
</style>
