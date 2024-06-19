import GetSimpleFmiResponse from '@/apis/fmiApi'
import { CommonParameters } from '@/queries/commonParameters'

const query =
  '&request=getFeature&storedquery_id=fmi::observations::mareograph::simple&parameters=WATLEV'

//TODO: implement inline in store
export async function* getWaterLevels(params: CommonParameters) {
  const pages = GetSimpleFmiResponse(query, params, params.mareographSites)
  for await (const page of pages) {
    yield page
  }
}
