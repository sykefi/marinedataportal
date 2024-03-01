import getVeslaData from '@/apis/sykeApi'
import { Site, SiteTypes } from '../site'
import { chunkArray, buildODataInFilterFromArray } from '@/helpers'

const query =
  'sites?api-version=1.0&\
$select=SiteId,Name,Latitude,Longitude,Depth&'

export async function* getVeslaSites(ids: number[]) {
  const chunks = chunkArray(ids, 200)
  for (const chunk of chunks) {
    if (chunk.find((i) => i > 0)) {
      const filter =
        '$filter=' + buildODataInFilterFromArray(chunk, 'SiteId', false)
      const res = (await getVeslaData(query + filter)) as Array<{
        siteId: number
        name: string
        latitude: number
        longitude: number
        depth: number | null
      }>

      yield res.map((r) =>
          new Site(
            r.siteId,
            r.name,
            r.latitude,
            r.longitude,
            r.depth,
            SiteTypes.Vesla
          )
      )
    }
  }
}
