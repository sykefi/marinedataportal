import { beforeEach, describe, expect, it } from 'vitest'
import { useWaterQualityStore, DepthOptions } from '@/stores/waterQualityStore'
import { setActivePinia } from 'pinia'
import { createPinia } from 'pinia'

describe('Water quality store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has errors if depth interval selection has missing values', () => {
    const store = useWaterQualityStore()
    store.selectedDepth = { option: DepthOptions.DepthInterval }
    expect(store.errors).contains('$missingDepthStart')
    expect(store.errors).contains('$missingDepthEnd')

    store.selectedDepth = { option: DepthOptions.SeaFloorLayer }
    expect(store.errors).not.contains('$missingDepthStart')
    expect(store.errors).not.contains('$missingDepthEnd')
  })
  it('has error if depth start is greater than depth end', () => {
    const store = useWaterQualityStore()
    store.selectedDepth = {
      option: DepthOptions.DepthInterval,
      start: 1,
      end: 2,
    }
    expect(store.errors).not.contains('$depthStartGreaterThanDepthEnd')

    store.selectedDepth = {
      option: DepthOptions.DepthInterval,
      start: 2,
      end: 2,
    }
    expect(store.errors).not.contains('$depthStartGreaterThanDepthEnd')

    store.selectedDepth = {
      option: DepthOptions.DepthInterval,
      start: 3,
      end: 2,
    }
    expect(store.errors).contains('$depthStartGreaterThanDepthEnd')

    // check that values are ignored when option is not interval
    store.selectedDepth = {
      option: DepthOptions.SurfaceLayer,
      start: 3,
      end: 2,
    }
    expect(store.errors).not.contains('$depthStartGreaterThanDepthEnd')
  })
})
