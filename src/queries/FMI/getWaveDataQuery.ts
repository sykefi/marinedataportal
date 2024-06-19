import GetSimpleFmiResponse from '@/apis/fmiApi'
import { CommonParameters } from '@/queries/commonParameters'

export enum WaveQueryParameters {
  waveHeight = 'WaveHs',
  direction = 'ModalWDi',
  directionDeviation = 'WHDD',
  modalPeriod = 'WTP',
  waterTemperature = 'TWATER',
}

//TODO: implement inline in store
export async function* getWaveData(
  params: CommonParameters,
  queryParams: WaveQueryParameters[]
) {
  const query =
    '&request=getFeature&storedquery_id=fmi::observations::wave::simple&parameters=' +
    queryParams.join(',')
  const pages = GetSimpleFmiResponse(query, params, params.buoySites)

  for await (const page of pages) {
    yield page
  }
}
