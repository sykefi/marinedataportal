export interface IResponseFormat {
  time: string
  analyteName: string
  value: number
  unit: string
  siteId: number
  site: string
  siteLatitudeWGS84: number
  siteLongitudeWGS84: number
  samplingLatitudeWGS84?: number | null
  samplingLongitudeWGS84?: number | null
  sampleDepthM?: number | null
  sampleDepthUpperM?: number | null
  sampleDepthLowerM?: number | null
  siteDepthM?: number | null
  totalDepthM?: number | null
  laboratory?: string | null
  dataSource: string
}
