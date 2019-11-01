import GetFmiData from '@/apis/fmiApi';
import { CommonParameters } from '@/queries/commonParameters';

const query = '&request=getFeature&storedquery_id=fmi::observations::mareograph::simple&parameters=WATLEV';

export interface IWaterLevelResponse {
  time: Date;
  value: number;
}

export async function getWaterLevels(params: CommonParameters) {
  const results = await GetFmiData(query, params);
  const responses: IWaterLevelResponse[] = [];
  results.forEach((result) => {
    responses.push({ time: result.time, value: Number.parseFloat(result.value) });
  });
  return responses;
}
