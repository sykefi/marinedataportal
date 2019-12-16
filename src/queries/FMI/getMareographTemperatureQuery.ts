import { GetSimpleFmiResponse } from '@/apis/fmiApi';
import { CommonParameters } from '@/queries/commonParameters';

const query = '&request=getFeature&storedquery_id=fmi::observations::mareograph::simple&parameters=TW_PT1H_AVG';


export async function getMareographTemperatures(params: CommonParameters) {
  const response = await GetSimpleFmiResponse(query, params, params.mareographSites);
  response.map((item) => delete item.responseId);
  return response;
}
