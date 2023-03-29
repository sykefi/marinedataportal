import { searchParameterModule } from "@/store/searchParameterModule";
import { mapModule } from "@/store/mapModule";
import { DragBox } from "ol/interaction";
import { platformModifierKeyOnly } from "ol/events/condition";
import WMTS from "ol/source/WMTS";
import { computed, defineComponent, onMounted, ref } from "vue";

interface IHoverData {
  name: string;
  coordinates: number[];
}

export default defineComponent({
  setup() {
    const center = ref([2466417.9856569725, 8788780.630851416]);
    const zoom = ref(5.5);
    const currentHoverFeature = ref(null as IHoverData | null);
    const selectedMapFeatures = ref([] as any[]);
    const selectInteraction = ref(null as any);
    const baseMapLayer = ref(null as any);
    const cityNamesLayer = ref(null as any);
    const vectorSource = ref(null as any);
    const map = ref(null as any);

    const availableFeatures = () => {
      // wrap sites as GeoJSON Features
      return searchParameterModule.availableSites.map((s) => {
        return {
          type: "Feature",
          id: s.id,
          geometry: {
            type: "Point",
            coordinates: s.mapCoordinates,
          },
          properties: { name: s.displayName },
        };
      });
    };

    const selectedFeatures = computed({
      get(): any[] {
        return selectedMapFeatures.value;
      },
      set(feats: any[]) {
        searchParameterModule.clearSelectedSites();
        feats.forEach((feat) => {
          searchParameterModule.selectSite(feat.id);
        });
        selectedMapFeatures.value = feats;
      },
    });

    onMounted(() => {
      if (baseMapLayer.value.$layer) {
        // if the layer has been mounted, set the options here.
        // otherwise use the layerMounted event
        baseMapLayer.value.setSource(new WMTS(mapModule.baseMapOptions!));
      }

      if (cityNamesLayer.value.$layer) {
        cityNamesLayer.value.setSource(
          new WMTS(mapModule.cityNameLayerOptions!)
        );
      }
    });

    const baseMapLayerMounted = (layer: any) => {
      if (mapModule.baseMapOptions) {
        layer.$layer.setSource(new WMTS(mapModule.baseMapOptions));
      }
    };

    const cityNamesLayerMounted = (layer: any) => {
      if (mapModule.cityNameLayerOptions) {
        layer.$layer.setSource(new WMTS(mapModule.cityNameLayerOptions));
      }
    };

    const mapCreated = (map: any) => {
      // a DragBox interaction used to select features by drawing boxes
      const dragBox = new DragBox({
        condition: platformModifierKeyOnly,
        onBoxEnd: () => {
          // features that intersect the box are selected
          const extent = dragBox.getGeometry().getExtent();
          const source = vectorSource.value.$source;

          const selectedFeats: any[] = [];
          source.forEachFeatureIntersectingExtent(extent, (feature: any) => {
            // feature = olExt.writeGeoJsonFeature(feature);

            selectedFeats.push(feature);
          });
          selectedFeatures.value = selectedFeats;
        },
      });

      map.$map.addInteraction(dragBox);

      // clear selection when drawing a new box and when clicking on the map
      dragBox.on("boxstart", () => {
        selectedFeatures.value = [];
        selectInteraction.value.clearFeatures();
      });
    };

    const onMapPointerMove = ({ dragging, pixel }: any) => {
      if (dragging) {
        return;
      }
      const hitFeature = map.value.forEachFeatureAtPixel(
        pixel,
        (feat: any) => feat
      );
      if (!hitFeature) {
        currentHoverFeature.value = null;
        // this.mapCursor = "default";
        return;
      }
      // this.mapCursor = "pointer";
      currentHoverFeature.value = {
        name: hitFeature.get("name"),
        coordinates: hitFeature.getGeometry().getCoordinates(),
      };
    };

    const addSelection = (id: number) => {
      selectInteraction.value.select(id);
    };

    const removeSelection = (id: number) => {
      selectInteraction.value.clearFeatures();
      const mapFeatureIndex = selectedMapFeatures.value.findIndex(
        (f) => f.id === id
      );
      selectedMapFeatures.value.splice(mapFeatureIndex, 1);
    };

    const clearSelectedFeatures = () => {
      selectInteraction.value.clearFeatures();
      selectedMapFeatures.value = [];
    };

    return {
      center,
      zoom,
      currentHoverFeature,
      selectedMapFeatures,
      selectInteraction,
      availableFeatures,
      selectedFeatures,
      baseMapLayerMounted,
      cityNamesLayerMounted,
      mapCreated,
      onMapPointerMove,
      addSelection,
      removeSelection,
      clearSelectedFeatures,
    };
  },
});
// data() {
//   return {
//     mapCenter: [2466417.9856569725, 8788780.630851416],
//     mapZoom: 5.5,
//     mapCursor: "default",
//     currentHoverFeature: null as IHoverData | null,
//     selectedMapFeatures: [] as any[],
//     selectInteraction: null as any,
//   };
// },
// computed: {
//   availableFeatures() {
//     // wrap sites as GeoJSON Features
//     return searchParameterModule.availableSites.map((s) => {
//       return {
//         type: "Feature",
//         id: s.id,
//         geometry: {
//           type: "Point",
//           coordinates: s.mapCoordinates,
//         },
//         properties: { name: s.displayName },
//       };
//     });
//   },
//   selectedFeatures: {
//     get(): any[] {
//       return this.selectedMapFeatures;
//     },
//     set(feats: any[]) {
//       searchParameterModule.clearSelectedSites();
//       feats.forEach((feat) => {
//         searchParameterModule.selectSite(feat.id);
//       });
//       this.selectedMapFeatures = feats;
//     },
//   },
// },
// mounted() {
//   this.selectInteraction = this.$refs.selectInteraction;
//   const baseMapLayer = (this.$refs.baseMapLayer as any).$layer;
//   if (baseMapLayer) {
//     // if the layer has been mounted, set the options here.
//     // otherwise use the layerMounted event
//     baseMapLayer.setSource(new WMTS(mapModule.baseMapOptions!));
//   }

//   const cityNamesLayer = (this.$refs.cityNamesLayer as any).$layer;
//   if (cityNamesLayer) {
//     cityNamesLayer.setSource(new WMTS(mapModule.cityNameLayerOptions!));
//   }
// },
// methods: {
//   baseMapLayerMounted(layer: any) {
//     if (mapModule.baseMapOptions) {
//       layer.$layer.setSource(new WMTS(mapModule.baseMapOptions));
//     }
//   },
//   cityNamesLayerMounted(layer: any) {
//     if (mapModule.cityNameLayerOptions) {
//       layer.$layer.setSource(new WMTS(mapModule.cityNameLayerOptions));
//     }
//   },
//   mapCreated(map: any) {
//     // a DragBox interaction used to select features by drawing boxes
//     const dragBox = new DragBox({
//       condition: platformModifierKeyOnly,
//       onBoxEnd: () => {
//         // features that intersect the box are selected
//         const extent = dragBox.getGeometry().getExtent();
//         const source = (this.$refs.vectorSource as any).$source;

//         const selectedFeats: any[] = [];
//         source.forEachFeatureIntersectingExtent(extent, (feature: any) => {
//           feature = olExt.writeGeoJsonFeature(feature);

//           selectedFeats.push(feature);
//         });
//         this.selectedFeatures = selectedFeats;
//       },
//     });

//     map.$map.addInteraction(dragBox);

//     // clear selection when drawing a new box and when clicking on the map
//     dragBox.on("boxstart", () => {
//       this.selectedFeatures = [];
//       this.selectInteraction.clearFeatures();
//     });
//   },
//   onMapPointerMove({ dragging, pixel }: any) {
//     if (dragging) {
//       return;
//     }
//     const hitFeature = (this.$refs.map as any).forEachFeatureAtPixel(
//       pixel,
//       (feat: any) => feat
//     );
//     if (!hitFeature) {
//       this.currentHoverFeature = null;
//       this.mapCursor = "default";
//       return;
//     }
//     this.mapCursor = "pointer";
//     this.currentHoverFeature = {
//       name: hitFeature.get("name"),
//       coordinates: hitFeature.getGeometry().getCoordinates(),
//     };
//   },
//   addSelection(id: number) {
//     this.selectInteraction.select(id);
//   },
//   removeSelection(id: number) {
//     this.selectInteraction.clearFeatures();
//     const mapFeatureIndex = this.selectedMapFeatures.findIndex(
//       (f) => f.id === id
//     );
//     this.selectedMapFeatures.splice(mapFeatureIndex, 1);
//   },
//   clearSelectedFeatures() {
//     this.selectInteraction.clearFeatures();
//     this.selectedMapFeatures = [];
//   },
// },
