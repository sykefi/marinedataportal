import { Component, Vue } from 'vue-property-decorator';
import { searchParameterModule } from '@/store/searchParameterModule';
import { mapModule } from '@/store/mapModule';
import { DragBox } from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';
import * as olExt from 'vuelayers/lib/ol-ext';
import WMTS from 'ol/source/WMTS';

interface IHoverData {
  name: string;
  coordinates: number[];
}

@Component
export default class Map extends Vue {
  public mapCenter: number[] =
    [2466417.9856569725, 8788780.630851416];
  public mapZoom = 5.5;
  public mapCursor = 'default';

  public currentHoverFeature: IHoverData | null = null;

  private selectedMapFeatures: any[] = [];
  private selectInteraction: any;

  get availableFeatures() {
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
          properties: { name: s.displayName },
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

  public mounted() {
    this.selectInteraction = this.$refs.selectInteraction;
    const baseMapLayer = (this.$refs.baseMapLayer as any).$layer;
    if (baseMapLayer) {
      // if the layer has been mounted, set the options here.
      // otherwise use the layerMounted event
      baseMapLayer.setSource(new WMTS(mapModule.baseMapOptions!));
    }

    const cityNamesLayer = (this.$refs.cityNamesLayer as any).$layer;
    if (cityNamesLayer) {
      cityNamesLayer.setSource(new WMTS(mapModule.cityNameLayerOptions!));
    }
  }

  public baseMapLayerMounted(layer: any) {
    if (mapModule.baseMapOptions) {
      layer.$layer.setSource(new WMTS(mapModule.baseMapOptions));
    }
  }

  public cityNamesLayerMounted(layer: any) {
    if (mapModule.cityNameLayerOptions) {
      layer.$layer.setSource(new WMTS(mapModule.cityNameLayerOptions));
    }
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
      this.selectInteraction.clearFeatures();
    });
  }

  public onMapPointerMove({ dragging, pixel }: any) {
    if (dragging) {
      return;
    }
    const hitFeature = (this.$refs.map as any).forEachFeatureAtPixel(pixel, (feat: any) => feat);
    if (!hitFeature) {
      this.currentHoverFeature = null;
      this.mapCursor = 'default';
      return;
    }
    this.mapCursor = 'pointer';
    this.currentHoverFeature = {
      name: hitFeature.get('name'),
      coordinates: hitFeature.getGeometry().getCoordinates(),
    };
  }

  public addSelection(id: number) {
    this.selectInteraction.select(id);
  }

  public removeSelection(id: number) {
    this.selectInteraction.clearFeatures();
    const mapFeatureIndex = this.selectedMapFeatures.findIndex((f) => f.id === id);
    this.selectedMapFeatures.splice(mapFeatureIndex, 1);
  }

  public clearSelectedFeatures() {
    this.selectInteraction.clearFeatures();
    this.selectedMapFeatures = [];
  }

}
