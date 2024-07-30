import GetSimpleFmiResponse from '@/apis/fmiApi'
import { CommonParameters } from '@/queries/commonParameters'

const query =
  '&request=getFeature&storedquery_id=fmi::observations::mareograph::simple&parameters=TW_PT1H_AVG'

//TODO: this could probably implemented inline in the store
export async function* getMareographTemperatures(params: CommonParameters) {
  const pages = GetSimpleFmiResponse(query, params, params.mareographSites)
  for await (const page of pages) {
    yield page
  }
}
