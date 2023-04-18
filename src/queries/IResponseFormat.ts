export interface IResponseFormat {
  time: string
  analyteName: string
  value: string
  unit: string
  siteId: number
  site: string
  siteLatitudeWGS84: string
  siteLongitudeWGS84: string
  samplingLatitudeWGS84?: string | null
  samplingLongitudeWGS84?: string | null
  sampleDepthM?: string | null
  sampleDepthUpperM?: string | null
  sampleDepthLowerM?: string | null
  siteDepthM?: string | null
  totalDepthM?: string | null
  laboratory?: string | null
  dataSource: string
}
