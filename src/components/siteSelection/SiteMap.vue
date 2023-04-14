<template>
  <ol-map
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    ref="map"
    style="height: 40rem"
    :style="{ cursor: mapCursor }"
  >
    <ol-view :center="mapCenter" :zoom="mapZoom" />

    <ol-tile-layer ref="baseMapLayer" />
    <ol-tile-layer ref="cityNamesLayer" />

    <ol-vector-layer>
      <ol-source-vector :features="availableFeatures"></ol-source-vector>
    </ol-vector-layer>

    <ol-interaction-select
      @select="featureSelected"
      :condition="mouseClick"
      :features="selectedFeatures"
    >
      <ol-style>
        <ol-style-fill color="blue" />
      </ol-style>
    </ol-interaction-select>

    <!-- <ol-overlay
      :offset="[10, -20]"
      v-if="currentHoverFeature"
      :position="currentHoverFeature.coordinates"
    >
      <div class="map-hover" v-html="currentHoverFeature.name" />
    </ol-overlay> -->
  </ol-map>
</template>

<script lang="ts">
import { DragBox } from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';
import WMTS from 'ol/source/WMTS';
import { defineComponent, inject, ref } from 'vue';
import { useSearchParameterStore } from '@/stores/searchParameterStore';
import { useMapStore } from '@/stores/mapStore';
import { Options } from 'ol/source/WMTS';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import Collection from 'ol/Collection';
import { GeoJSON } from 'ol/format';

interface IHoverData {
  name: string;
  coordinates: number[];
}

export default defineComponent({
  mounted() {
    const mapStore = useMapStore();
    (this.$refs.baseMapLayer as any).tileLayer.setSource(
      new WMTS(mapStore.baseMapOptions! as Options)
    );
    (this.$refs.cityNamesLayer as any).tileLayer.setSource(
      new WMTS(mapStore.cityNameLayerOptions! as Options)
    );
  },
  setup() {
    const searchParameterStore = useSearchParameterStore();

    const center = ref([2466417.9856569725, 8788780.630851416]);
    const zoom = ref(5.5);
    const currentHoverFeature = ref(null as IHoverData | null);
    const selectedFeatures = ref(new Collection());
    const availableFeatures = ref([] as Feature<Geometry>[]);
    const mapCursor = ref('default');

    // const format = inject('ol-format');
    // const GeoJSON = new format.GeoJSON();
    const selectConditions = inject('ol-selectconditions');
    const mouseClick = selectConditions.singleClick;

    const features = searchParameterStore.availableSites.map((s) => ({
      type: 'Feature',
      id: s.id,
      geometry: { type: 'Point', coordinates: s.mapCoordinates },
      properties: { name: s.displayName },
    }));

    const geoJsonObject = {
      type: 'FeatureCollection',
      features,
    };

    availableFeatures.value = new GeoJSON().readFeatures(geoJsonObject);

    console.log('a', availableFeatures);
    // set(feats: any[]) {
    //   searchParameterStore.clearSelectedSites();
    //   feats.forEach((feat) => {
    //     searchParameterStore.selectSite(feat.id);
    //   });
    //   selectedMapFeatures.value = feats;
    // },

    const featureSelected = (event: any) => {
      console.log('e', event);
      selectedFeatures.value = event.target.getFeatures();
      searchParameterStore.selectSite(event.value);
    };

    console.log('s', selectedFeatures);
    // const mapCreated = (map: any) => {
    //   console.log('map created');
    //   // a DragBox interaction used to select features by drawing boxes
    //   const dragBox = new DragBox({
    //     condition: platformModifierKeyOnly,
    //     onBoxEnd: () => {
    //       // features that intersect the box are selected
    //       const extent = dragBox.getGeometry().getExtent();
    //       const source = vectorSource.value.$source;

    //       const selectedFeats: any[] = [];
    //       source.forEachFeatureIntersectingExtent(extent, (feature: any) => {
    //         // feature = olExt.writeGeoJsonFeature(feature);

    //         selectedFeats.push(feature);
    //       });
    //       selectedFeatures.value = selectedFeats;
    //     },
    //   });

    //   map.$map.addInteraction(dragBox);

    //   // clear selection when drawing a new box and when clicking on the map
    //   dragBox.on('boxstart', () => {
    //     selectedFeatures.value = [];
    //     selectInteraction.value.clearFeatures();
    //   });
    // };

    // const onMapPointerMove = ({ dragging, pixel }: any) => {
    //   if (dragging) {
    //     return;
    //   }
    //   const hitFeature = map.value.forEachFeatureAtPixel(
    //     pixel,
    //     (feat: any) => feat
    //   );
    //   if (!hitFeature) {
    //     currentHoverFeature.value = null;
    //     // this.mapCursor = "default";
    //     return;
    //   }
    //   // this.mapCursor = "pointer";
    //   currentHoverFeature.value = {
    //     name: hitFeature.get('name'),
    //     coordinates: hitFeature.getGeometry().getCoordinates(),
    //   };
    // };

    // const addSelection = (id: number) => {
    //   selectInteraction.value.select(id);
    // };

    // const removeSelection = (id: number) => {
    //   selectInteraction.value.clearFeatures();
    //   const mapFeatureIndex = selectedFeatures.value.findIndex(
    //     (f) => f.id === id
    //   );
    //   selectedFeatures.value.splice(mapFeatureIndex, 1);
    // };

    // const clearSelectedFeatures = () => {
    //   selectInteraction.value.clearFeatures();
    //   selectedFeatures.value = [];
    // };

    return {
      mapCenter: center,
      mapZoom: zoom,
      mapCursor,
      currentHoverFeature,
      selectedFeatures,
      availableFeatures,
      featureSelected,
      mouseClick,
      // onMapPointerMove,
      // addSelection,
      // removeSelection,
      // clearSelectedFeatures,
    };
  },
});
</script>

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
