<template>
  <ol-map
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    @pointermove="onMapPointerMove"
    ref="map"
    style="height: 40rem"
    :style="{ cursor: mapCursor }"
  >
    <ol-view ref="view" :center="mapCenter" :zoom="mapZoom" />

    <ol-tile-layer ref="baseMapLayer" />
    <ol-tile-layer ref="cityNamesLayer" />

    <ol-vector-layer>
      <ol-source-vector
        :features="availableFeatures"
        ref="vectorSource"
      ></ol-source-vector>
    </ol-vector-layer>

    <ol-interaction-select
      @select="featureSelected"
      :condition="mouseClick"
      :features="selectedFeatures"
    >
      <ol-style>
        <ol-style-circle :radius="6">
          <ol-style-fill color="#0099ff"></ol-style-fill>
          <ol-style-stroke color="white"></ol-style-stroke>
        </ol-style-circle>
      </ol-style>
    </ol-interaction-select>

    <ol-overlay
      :offset="[10, -20]"
      v-if="currentHoverFeature"
      :position="currentHoverFeature.coordinates"
    >
      <div class="map-hover" v-html="currentHoverFeature.name" />
    </ol-overlay>
  </ol-map>
</template>

<script lang="ts">
import { DragBox } from 'ol/interaction'
import { platformModifierKeyOnly } from 'ol/events/condition'
import WMTS from 'ol/source/WMTS'
import { defineComponent, inject, onMounted, ref } from 'vue'
import { useSearchParameterStore } from '@/stores/searchParameterStore'
import { useMapStore } from '@/stores/mapStore'
import { Options } from 'ol/source/WMTS'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import Collection from 'ol/Collection'
import Map from 'ol/Map'
import { SelectEvent } from 'ol/interaction/Select'

interface IHoverData {
  name: string
  coordinates: number[]
}

export default defineComponent({
  mounted() {
    const mapStore = useMapStore()
    ;(this.$refs.baseMapLayer as any).tileLayer.setSource(
      new WMTS(mapStore.baseMapOptions! as Options)
    )
    ;(this.$refs.cityNamesLayer as any).tileLayer.setSource(
      new WMTS(mapStore.cityNameLayerOptions! as Options)
    )
  },
  setup() {
    const searchParameterStore = useSearchParameterStore()

    const map = ref<{ map: Map }>(null!)
    const center = ref([2466417.9856569725, 8788780.630851416])
    const zoom = ref(5.5)
    const currentHoverFeature = ref(null as IHoverData | null)
    const selectedFeatures = ref(new Collection())
    const availableFeatures = searchParameterStore.availableSites.map(
      (s) =>
        new Feature({
          id: s.id,
          geometry: new Point(s.mapCoordinates),
          properties: { name: s.displayName },
        })
    )
    const mapCursor = ref('default')
    const vectorSource = ref(null as any)

    const selectConditions = inject('ol-selectconditions')
    const mouseClick = selectConditions.click

    const featureSelected = (event: SelectEvent) => {
      const newFeatures = event.target.getFeatures() as Collection<Feature>
      selectedFeatures.value = newFeatures
      searchParameterStore.clearSelectedSites()
      newFeatures.forEach((feat) => {
        const id = feat.getId()
        if (id) {
          searchParameterStore.selectSite(id as number)
        }
      })
    }

    const addSelection = (id: number) => {
      const feature = availableFeatures.find((f) => f.getId() === id)
      selectedFeatures.value.push(feature)
      searchParameterStore.selectSite(id)
    }

    const removeSelection = (id: number) => {
      const selectedFeatureIndex = (
        selectedFeatures.value.getArray() as Feature[]
      ).findIndex((f) => f.getId() === id)
      selectedFeatures.value.removeAt(selectedFeatureIndex)
      searchParameterStore.removeSite(id)
    }

    const clearSelectedFeatures = () => {
      selectedFeatures.value.clear()
      searchParameterStore.clearSelectedSites()
    }

    onMounted(() => {
      // a DragBox interaction used to select features by drawing boxes
      const dragBox = new DragBox({
        condition: platformModifierKeyOnly,
      })
      map.value?.map.addInteraction(dragBox)

      dragBox.on('boxend', function () {
        // features that intersect the box are selected
        const extent = dragBox.getGeometry().getExtent()
        const boxFeatures: Feature[] = vectorSource.value.features.filter(
          (feature: Feature) => feature.getGeometry()?.intersectsExtent(extent)
        )

        selectedFeatures.value.extend(boxFeatures)
        boxFeatures.forEach((feat: Feature) => {
          const id = feat.getId() as number
          if (id) {
            searchParameterStore.selectSite(id)
          }
        })
      })

      // clear selection when drawing a new box and when clicking on the map
      dragBox.on('boxstart', () => {
        selectedFeatures.value.clear()
        searchParameterStore.clearSelectedSites()
      })
    })

    const onMapPointerMove = (e: any) => {
      if (!e.pixel || e.dragging) {
        return
      }
      const hitFeature = map.value?.map.forEachFeatureAtPixel(
        e.pixel,
        (feat: any) => feat
      )
      if (!hitFeature) {
        currentHoverFeature.value = null
        mapCursor.value = 'default'
        return
      }
      mapCursor.value = 'pointer'
      currentHoverFeature.value = {
        name: hitFeature.get('name'),
        coordinates: hitFeature.getGeometry().getCoordinates(),
      }
    }

    return {
      map,
      vectorSource,
      mapCenter: center,
      mapZoom: zoom,
      mapCursor,
      currentHoverFeature,
      selectedFeatures,
      availableFeatures,
      featureSelected,
      mouseClick,
      onMapPointerMove,
      addSelection,
      removeSelection,
      clearSelectedFeatures,
    }
  },
})
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
