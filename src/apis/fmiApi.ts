// tslint:disable:no-console
import { CommonParameters } from '@/queries/commonParameters';
import { Site } from '@/queries/site';

const QUERY_URL =
  'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0';

export interface IFmiResult {
  time: Date;
  parameterName: string;
  value: string;
  position: string;
  dataSource: string;
  siteName: string;
  siteId: number;
}

export async function GetRawXMLResponse(query: string) {
  return await getXmlResponse(QUERY_URL + query);
}


export async function GetFmiData(query: string, params: CommonParameters) {
  const dateSpans = getDates(params.dateStart, params.dateEnd, 6);
  const results: IFmiResult[] = [];
  for (const site of params.mareographSites) {
    for (let i = 0; i < dateSpans.length - 1; i++) {
      const startDate = dateSpans[i];
      const endDate = dateSpans[i + 1];
      const res = (await getXmlResponse(QUERY_URL + query + formatParams(startDate, endDate, site.id)));
      const elements = res.getElementsByTagName('BsWfs:BsWfsElement');
      results.push(...parseResponse(elements, site));
    }
  }
  return results;
}

function parseResponse(elements: HTMLCollectionOf<Element>, site: Site) {
  const results: IFmiResult[] = [];
  for (const element of elements) {
    const time = element.getElementsByTagName('BsWfs:Time')[0].firstChild!.nodeValue!;
    const parameterName = element.getElementsByTagName('BsWfs:ParameterName')[0].firstChild!.nodeValue!;
    const value = element.getElementsByTagName('BsWfs:ParameterValue')[0].firstChild!.nodeValue!;
    // tslint:disable-next-line:max-line-length
    const result: IFmiResult = {
      time: new Date(time),
      parameterName,
      value,
      position: site.lat + ' ' + site.long,
      siteId: site.id,
      siteName: site.name,
      dataSource: 'FMI',
    };
    results.push(result);
  }
  console.log(results);
  return results;
}

function formatParams(dateStart: Date, dateEnd: Date, siteId: number) {
  let s = '';
  s += '&starttime=' + dateStart.toISOString();
  s += '&endtime=' + dateEnd.toISOString();
  s += '&fmisid=' + siteId;

  return s;
}

async function getXmlResponse(url: string) {
  return new Promise<Document>((resolve: any, reject: any) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    console.log(url);
    xhr.responseType = 'text';
    xhr.onload = () => {
      const status = xhr.status;
      if (status === 200) {
        const oParser = new DOMParser();
        const oDOM = oParser.parseFromString(xhr.response, 'application/xml');
        console.log(oDOM);
        resolve(oDOM);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
}

/** Get all the dates between a start and an end date
 * @param timeSpan How to split the time range, in number of days. Example: to get a range of weeks, timespan is 7
 */
function getDates(startDate: Date, stopDate: Date, timeSpan: number) {
  const dateArray: Date[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = addDay(currentDate);
  }

  const filtered: Date[] = [];

  for (let i = 0; i < dateArray.length; i += timeSpan) {
    filtered.push(dateArray[i]);
  }
  if (!filtered.includes(stopDate)) {
    filtered.push(stopDate);
  }

  return filtered;


  function addDay(date: Date) {
    date.setDate(date.getDate() + 1);
    return date;
  }
}
