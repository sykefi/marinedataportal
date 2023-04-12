// tslint:disable:no-console

import { useMainStateStore } from '@/stores/mainStateStore';

export default async function getVeslaData(query: string) {
  const mainState = useMainStateStore();
  try {
    let res = await getJsonResponse(
      'https://rajapinnat.ymparisto.fi/api/meritietoportaali/api/' + query
    );
    const data = res.value;
    while (res.nextLink) {
      res = await getJsonResponse(res.nextLink);
      data.push(...res.value);
    }
    if (data.length && data[0] instanceof Object) {
      data.forEach((obj) => {
        obj.dataSource = 'SYKE';
      });
    }
    return data;
  } catch (e) {
    console.error(e);
    mainState.setError(true);
    return null;
  }
}

interface IODataResponse {
  nextLink: string;
  value: any[];
}

interface ErrorResponse {
  error: {
    innererror: {
      message: string;
    };
  };
}

async function getJsonResponse(url: string): Promise<IODataResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    let errorObj: ErrorResponse | undefined;
    try {
      errorObj = (await response.json()) as ErrorResponse;
    } catch {
      errorObj = undefined;
    }
    throw new Error(`Server responded with error:
        status=${response.status}
        statusText=${response.statusText}
        url= ${response.url}
        message=${
          errorObj
            ? errorObj.error.innererror.message
            : 'Error message not defined by the server'
        }`);
  }

  const json = await response.json();
  return {
    nextLink: json['@odata.nextLink'],
    value: json.value,
  };
}
