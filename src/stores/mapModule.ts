import { Module, VuexModule, Action } from 'vuex-class-modules';
import store from './store';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import { optionsFromCapabilities, Options } from 'ol/source/WMTS';

@Module({ generateMutationSetters: true })
class MapModule extends VuexModule {
  public baseMapOptions: Options | null = null;
  public cityNameLayerOptions: Options | null = null;

  @Action
  public async generateMapOptions() {
    // add projection params taken from https://epsg.io/3857.proj4
    proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');
    register(proj4);
    await this.generateBaseMapOptions();
    await this.generateCityNameOptions();
  }

  private async generateCityNameOptions() {
    const parser = new WMTSCapabilities();
    const response = await fetch('https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/WMTS/1.0.0/WMTSCapabilities.xml');
    const text = await response.text();
    this.cityNameLayerOptions = optionsFromCapabilities(
      parser.read(text),
      {
        layer: 'Canvas_World_Dark_Gray_Reference',
        matrixSet: 'EPSG:3857',
      },
    );
  }

  private async generateBaseMapOptions() {
    const parser = new WMTSCapabilities();
    const response = await fetch('https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/WMTS/1.0.0/WMTSCapabilities.xml');
    const text = await response.text();
    this.baseMapOptions = optionsFromCapabilities(
      parser.read(text),
      {
        layer: 'Canvas_World_Light_Gray_Base',
        matrixSet: 'EPSG:3857',
      },
    );
  }

}

export const mapModule = new MapModule({
  store,
  name: 'map',
});
