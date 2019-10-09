// tslint:disable:no-console

const QUERY_URL =
  'https://rajapinnat.ymparisto.fi/api/vesla/2.0/odata/';

export default async function GetVeslaData(query: string) {
  const res = (await getJsonResponse(QUERY_URL + query));
  console.log(res);
}

function getJsonResponse(url: string) {
  return new Promise((resolve: any, reject: any) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    console.log(url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      const status = xhr.status;
      if (status === 200) {
        resolve(xhr.response.value);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
}

