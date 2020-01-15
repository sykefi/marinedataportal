import { GetRawXMLResponse } from '@/apis/fmiApi';
import { Site, SiteTypes } from '../site';

const query = '&request=getFeature&storedquery_id=fmi::ef::stations&networkid=137&';

export async function getBuoys() {
  const sites: Site[] = [];
  const response = await GetRawXMLResponse(query);
  if (response) {
    const facilities = response.getElementsByTagName('ef:EnvironmentalMonitoringFacility');
    for (const facility of facilities) {
      const id = facility.getElementsByTagName('gml:identifier')[0].firstChild!.nodeValue!;
      const name = facility.getElementsByTagName('ef:name')[0].firstChild!.nodeValue!;
      // tslint:disable-next-line:max-line-length
      const pos = facility.getElementsByTagName('ef:representativePoint')[0].firstElementChild!.firstElementChild!.textContent!.split(' ');

      sites.push(new Site(+id, name, +pos[0], +pos[1], null, SiteTypes.FmiBuoy));
    }
  }
  return sites;

}
