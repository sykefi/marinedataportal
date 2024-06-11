import getVeslaData from '@/apis/sykeApi'
import { Site, SiteTypes } from '../site'
import { chunkArray, buildODataInFilterFromArray } from '@/helpers'

const query = '$select=SiteId,Name,Latitude,Longitude,Depth&'

//use a generator function to get at most 200 sites at once
//the staggered loading makes the UI more responsive when the user is loading hundreds of sites
export async function* getVeslaSites(ids: number[]) {
  const uniqueIds = [...new Set(ids)] //first remove duplicates
  const chunks = chunkArray(uniqueIds, 200)
  for (const chunk of chunks) {
    if (chunk.find((i) => i > 0)) {
      const filter =
        '$filter=' + buildODataInFilterFromArray(chunk, 'SiteId', false)
      const res = (await getVeslaData('Sites', query + filter)) as Array<{
        siteId: number
        name: string
        latitude: number
        longitude: number
        depth: number | null
      }>

      yield res.map(
        (r) =>
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
