import { GetSimpleFmiResponse } from '@/apis/fmiApi';
import { CommonParameters } from '@/queries/commonParameters';


export enum WaveQueryParameters {
  waveHeight = 'WaveHs',
  direction = 'ModalWDi',
  directionDeviation = 'WHDD',
  modalPeriod = 'WTP',
  waterTemperature = 'TWATER',
}

export async function getWaveData(params: CommonParameters, queryParams: WaveQueryParameters[], pivot: boolean) {
  const query = '&request=getFeature&storedquery_id=fmi::observations::wave::simple&parameters='
    + queryParams.join(',');
  const response = await GetSimpleFmiResponse(query, params, params.buoySites);

  if (!pivot) {
    response.map((item) => delete item.responseId);
    return response;
  }

  const ids = response.flatMap((r) => r.responseId);

  const retval: any[] = [];

  for (const id of ids) {

    const results = response.filter((r) => r.responseId === id);

    const first = results[0];

    const res: any = {
      time: first.time,
      siteId: first.siteId,
      siteName: first.siteName,
      lat: first.lat,
      long: first.long,
    };

    if (queryParams.includes(WaveQueryParameters.waveHeight)) {
      res.waveHeight = results.find((r) => r.parameterName === WaveQueryParameters.waveHeight)?.value;
    }
    if (queryParams.includes(WaveQueryParameters.direction)) {
      res.waveDirection = results.find((r) => r.parameterName === WaveQueryParameters.direction)?.value;
    }
    if (queryParams.includes(WaveQueryParameters.directionDeviation)) {
      res.directionDeviation = results.find((r) => r.parameterName === WaveQueryParameters.directionDeviation)?.value;
    }
    if (queryParams.includes(WaveQueryParameters.modalPeriod)) {
      res.modalPeriod = results.find((r) => r.parameterName === WaveQueryParameters.modalPeriod)?.value;
    }
    if (queryParams.includes(WaveQueryParameters.waterTemperature)) {
      res.waterTemperature = results.find((r) => r.parameterName === WaveQueryParameters.waterTemperature)?.value;
    }

    if (res.hasOwnProperty('waveHeight')
      || res.hasOwnProperty('waveDirection')
      || res.hasOwnProperty('waveDirectionDeviation')
      || res.hasOwnProperty('modalPeriod')
      || res.hasOwnProperty('waterTemperature')) {
      res.dataSource = first.dataSource,
        retval.push(res);
    }
  }

  return retval;
}
