import getVeslaData from '@/apis/sykeApi';
import { Site } from '../site';
import { chunkArray } from '@/helpers';

const query = 'Paikka?\
$select=Paikka_Id,Nimi,KoordLat,KoordLong&';

function getFilter(ids: number[]) {
  let filter = '$filter=(';

  ids.forEach((id) => {
    if (id) {
      filter += `Paikka_Id eq ${id} or `;
    }
  });

  filter = filter.substring(0, filter.length - 4);
  filter += ')';

  return filter;
}

export async function getVeslaSites(ids: number[]) {
  const chunks = chunkArray(ids, 20);
  const sites: Site[] = [];
  for (const chunk of chunks) {
    if (chunk.find((i) => i > 0)) {
      const res = await getVeslaData(query + getFilter(chunk)) as Array<{
        Paikka_Id: number,
        Nimi: string,
        KoordLat: string,
        KoordLong: string,
      }>;
      res.map((r) => sites.push(new Site(r.Paikka_Id, r.Nimi)));
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
