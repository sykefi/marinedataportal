import { GetSimpleFmiResponse } from '@/apis/fmiApi'
import { CommonParameters } from '@/queries/commonParameters'

export enum WaveQueryParameters {
  waveHeight = 'WaveHs',
  direction = 'ModalWDi',
  directionDeviation = 'WHDD',
  modalPeriod = 'WTP',
  waterTemperature = 'TWATER',
}

export async function getWaveData(
  params: CommonParameters,
  queryParams: WaveQueryParameters[]
) {
  const query =
    '&request=getFeature&storedquery_id=fmi::observations::wave::simple&parameters=' +
    queryParams.join(',')
  return await GetSimpleFmiResponse(query, params, params.buoySites)
}
