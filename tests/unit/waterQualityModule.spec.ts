import { expect } from 'chai'
import {
  WaterQualityModule,
  DepthOptions,
} from '@/store/attributeModules/waterQualityModule'
import Vuex from 'vuex'

describe('Water quality module', () => {
  const store = new Vuex.Store({ strict: true })
  const module = new WaterQualityModule({ store, name: 'testWaterQuality' })

  it('has errors if depth interval selection has missing values', () => {
    module.selectedDepth = { option: DepthOptions.DepthInterval }
    expect(module.errors).contains('$missingDepthStart')
    expect(module.errors).contains('$missingDepthEnd')

    module.selectedDepth = { option: DepthOptions.SeaFloorLayer }
    expect(module.errors).not.contains('$missingDepthStart')
    expect(module.errors).not.contains('$missingDepthEnd')
  })
  it('has error if depth start is greater than depth end', () => {
    module.selectedDepth = {
      option: DepthOptions.DepthInterval,
      start: 1,
      end: 2,
    }
    expect(module.errors).not.contains('$depthStartGreaterThanDepthEnd')

    module.selectedDepth = {
      option: DepthOptions.DepthInterval,
      start: 2,
      end: 2,
    }
    expect(module.errors).not.contains('$depthStartGreaterThanDepthEnd')

    module.selectedDepth = {
      option: DepthOptions.DepthInterval,
      start: 3,
      end: 2,
    }
    expect(module.errors).contains('$depthStartGreaterThanDepthEnd')

    // check that values are ignored when option is not interval
    module.selectedDepth = {
      option: DepthOptions.SurfaceLayer,
      start: 3,
      end: 2,
    }
    expect(module.errors).not.contains('$depthStartGreaterThanDepthEnd')
  })
})
