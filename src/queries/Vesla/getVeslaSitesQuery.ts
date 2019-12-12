import getVeslaData from '@/apis/sykeApi';
import { Site, SiteTypes } from '../site';
import { chunkArray, buildODataInFilterFromArray } from '@/helpers';

const query = 'sites?api-version=1.0&\
$select=SiteId,Name,Latitude,Longitude,Depth&';


export async function getVeslaSites(ids: number[]) {
  const chunks = chunkArray(ids, 200);
  const sites: Site[] = [];
  for (const chunk of chunks) {
    if (chunk.find((i) => i > 0)) {
      const filter = '$filter=' + buildODataInFilterFromArray(chunk, 'SiteId', false);
      const res = await getVeslaData(query + filter) as Array<{
        siteId: number,
        name: string,
        latitude: number,
        longitude: number,
        depth: number | null,
      }>;
      res.map((r) => sites.push(new Site(r.siteId, r.name, r.latitude, r.longitude, r.depth, SiteTypes.Vesla)));
    }
  }
  return sites;
}
