import getVeslaData from '@/apis/sykeApi';
import { Site } from '../site';
import { chunkArray, buildODataInFilterFromArray } from '@/helpers';

const query = 'sites?api-version=1.0&\
$select=SiteId,Name,Latitude,Longitude&';


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
      }>;
      res.map((r) => sites.push(new Site(r.siteId, r.name, r.latitude, r.longitude)));
    }
  }
  return sites.sort(sortAlphabetically);


  function sortAlphabetically(a: Site, b: Site) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
}
