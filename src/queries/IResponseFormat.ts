export interface IResponseFormat {
    time: string;
    analyteName: string;
    value: string;
    unit: string;
    siteId: number;
    site: string;
    siteLatitudeWGS84: number;
    siteLongitudeWGS84: number;
    samplingLatitudeWGS84?: number | null;
    samplingLongitudeWGS84?: number | null;
    sampleDepthM?: string | null;
    sampleDepthUpperM?: string | null;
    sampleDepthLowerM?: string | null;
    siteDepthM?: string | null;
    totalDepthM?: string | null;
    laboratory?: string | null;
    dataSource: string;
  }
