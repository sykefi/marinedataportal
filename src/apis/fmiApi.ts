// tslint:disable:no-console
import { CommonParameters } from '@/queries/commonParameters';

const QUERY_URL =
  'http://opendata.fmi.fi/wfs?service=WFS&version=2.0.0';

export interface IFmiResult {
  time: Date;
  parameterName: string;
  value: string;
}

export default async function GetFmiData(query: string, params: CommonParameters) {
  const res = (await getXmlResponse(QUERY_URL + query + formatParams(params)));
  const elements = res.getElementsByTagName('BsWfs:BsWfsElement');
  const results: IFmiResult[] = [];

  for (const element of elements) {
    const time = element.getElementsByTagName('BsWfs:Time')[0].firstChild!.nodeValue!;
    const parameterName = element.getElementsByTagName('BsWfs:ParameterName')[0].firstChild!.nodeValue!;
    const value = element.getElementsByTagName('BsWfs:ParameterValue')[0].firstChild!.nodeValue!;
    const result: IFmiResult = {
      time: new Date(time),
      parameterName,
      value,
    };
    results.push(result);
  }
  console.log(results);
  return results;
}

function formatParams(params: CommonParameters) {
  let s = '';
  s += '&starttime=' + params.formattedDateStart;
  s += '&endtime=' + params.formattedDateEnd;

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
        resolve(oDOM);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
}

