// tslint:disable:no-console
export default async function getVeslaData(query: string) {
  let res = await getJsonResponse('https://rajapinnat.ymparisto.fi/api/meritietoportaali/api/' + query);
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

function getJsonResponse(url: string): Promise<IODataResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    console.log(url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      const status = xhr.status;
      if (status === 200) {
        const response: IODataResponse = {
          nextLink: xhr.response['@odata.nextLink'],
          value: xhr.response.value,
        };
        resolve(response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
}

