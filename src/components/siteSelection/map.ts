import { Component, Vue } from 'vue-property-decorator';
import { searchParameterModule } from '@/store/searchParameterModule';
import { DragBox } from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';
import * as olExt from 'vuelayers/lib/ol-ext';

@Component
export default class Map extends Vue {
  public mapCenter: number[] =
    [2487172.855814102, 9051675.65284173];
  public mapZoom = 6;

  private selectedMapFeatures: any[] = [];

  get availableFeatures() {
    this.selectedMapFeatures = [];
    // wrap sites as GeoJSON Features
    return searchParameterModule.availableSites.map(
      (s) => {
        return {
          type: 'Feature',
          id: s.id,
          geometry: {
            type: 'Point',
            coordinates: s.mapCoordinates,
          },
          properties: { name: s.name },
        };
      });
  }

  get selectedFeatures() {
    return this.selectedMapFeatures;
  }

  set selectedFeatures(feats: any[]) {
    searchParameterModule.clearSelectedSites();
    feats.forEach((feat) => {
      searchParameterModule.selectSite(feat.id);
    });
    this.selectedMapFeatures = feats;
  }

  public mapCreated(map: any) {
    // a DragBox interaction used to select features by drawing boxes
    const dragBox = new DragBox({
      condition: platformModifierKeyOnly,
      onBoxEnd: () => {
        // features that intersect the box are selected
        const extent = dragBox.getGeometry().getExtent();
        const source = (this.$refs.vectorSource as any).$source;

        const selectedFeats: any[] = [];
        source.forEachFeatureIntersectingExtent(extent, (feature: any) => {
          feature = olExt.writeGeoJsonFeature(feature);

          selectedFeats.push(feature);
        });
        this.selectedFeatures = selectedFeats;
      },
    });

    map.$map.addInteraction(dragBox);

    // clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', () => {
      this.selectedFeatures = [];
    });
  }

  public removeSelection(id: number) {
    const mapFeatureIndex = this.selectedFeatures.findIndex((f) => f.id === id);
    this.selectedFeatures.splice(mapFeatureIndex, 1);
  }
}
