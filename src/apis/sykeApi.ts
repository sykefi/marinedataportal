// tslint:disable:no-console
export default async function getVeslaData(query: string) {
  let res: IODataResponse | null = null;
  try {
    res = await getJsonResponse('https://rajapinnat.ymparisto.fi/api/meritietoportaali/api/' + query);
  } catch (e) {
    console.error(e);
    return null;
  }
  const data = res.value;
  console.log('res', res);
  while (res.nextLink) {
    res = await getJsonResponse(res.nextLink);
    data.push(...res.value);
  }
  if (data.length && data[0] instanceof Object) {
    data.forEach((obj) => { obj.dataSource = 'SYKE'; });
  }

  return data;
}

interface IODataResponse {
  nextLink: string;
  value: any[];
}

async function getJsonResponse(url: string): Promise<IODataResponse> {
  const response = await fetch(url);
  const json = await response.json();

  console.log(json);
  return {
    nextLink: json['@odata.nextLink'],
    value: json.value,
  };
}

