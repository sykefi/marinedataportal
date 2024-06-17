import { useMainStateStore } from '@/stores/mainStateStore'

const apiBase = 'https://rajapinnat.ymparisto.fi/api/meritietoportaali/api/'

export async function getVeslaData(resource: string, query: string) {
  const mainState = useMainStateStore()
  try {
    let res = await postODataQuery(resource, query)
    const data = res.value

    while (res.nextLink) {
      const params = new URLSearchParams(res.nextLink.split('?')[1])
      const skipValue = params.get('$skip')
      if (!skipValue) {
        break
      }
      const newQuery = query + '&$skip=' + skipValue!
      res = await postODataQuery(resource, newQuery)
      data.push(...res.value)
    }
    if (data.length && data[0] instanceof Object) {
      data.forEach((obj) => {
        obj.dataSource = 'SYKE'
      })
    }
    return data
  } catch (e) {
    console.error(e)
    mainState.setError(true)
    return null
  }
}

/** provide a generator to loop through response OData pages */
export async function* getPagedODataResponse(resource: string, query: string) : AsyncGenerator<IODataResponse>{
  const mainState = useMainStateStore()
  try {
    let activeQuery = query;
    do{
      let res = await postODataQuery(resource, activeQuery)
      yield res;
      if (res.value.length == 0){
        return
      }
      if (!res.nextLink){
        return
      }
      const params = new URLSearchParams(res.nextLink.split('?')[1])
      const skipValue = params.get('$skip')
      if (skipValue) {
        activeQuery = query + '&$skip=' + skipValue!
      }
      else{
        activeQuery = ''
      }
    }while(activeQuery.length>0)
  } catch (e) {
    console.error(e)
    mainState.setError(true)
    return null
  }
}

export async function getSinglePageVeslaData(resource: string, query: string) {
  const mainState = useMainStateStore()
  try {
    let res = await postODataQuery(resource, query)
    if (res.value.length && res.value[0] instanceof Object) {
      res.value.forEach((obj) => {
        obj.dataSource = 'SYKE'
      })
    }
    return res
  } catch (e) {
    console.error(e)
    mainState.setError(true)
    return null
  }
}

/** If you have a $nextLink, use this method to translate it to a POST */
export async function getODataNextPage(resource: string, nextLink: string) {
  const mainState = useMainStateStore()
  try {

    const queryParams = nextLink.split('?')[1]
    const params = new URLSearchParams(queryParams)
    const skipValue = params.get('$skip')
    if (!skipValue) {
      return
    }
    let res = await postODataQuery(resource, queryParams)
    return res
  } catch (e) {
    console.error(e)
    mainState.setError(true)
    return null
  }
}

interface IODataResponse {
  nextLink: string
  value: any[]
}

interface ErrorResponse {
  error: {
    innererror: {
      message: string
    }
  }
}

async function postODataQuery(
  resource: string,
  query: string
): Promise<IODataResponse> {
  const response = await fetch(apiBase +resource +'/$query?api-version=1.0',
    {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'text/plain',
      },
      body: query,
    }
  )
  return await parseResponse(response)
}

async function GetODataResponse(url: string,
): Promise<IODataResponse> {
const response = await fetch(url)
return await parseResponse(response)
}

async function parseResponse(response: Response){
  if (!response.ok) {
    let errorObj: ErrorResponse | undefined
    try {
      errorObj = (await response.json()) as ErrorResponse
    } catch {
      errorObj = undefined
    }
    throw new Error(`Server responded with error:
        status=${response.status}
        statusText=${response.statusText}
        url= ${response.url}
        message=${
          errorObj
            ? errorObj.error.innererror.message
            : 'Error message not defined by the server'
        }`)
  }

  const json = await response.json()
  if (json.value.length && json.value[0] instanceof Object) {
    json.value.forEach((obj: any) => {
      obj.dataSource = 'SYKE'
    })
  }
  return {
    nextLink: json['@odata.nextLink'],
    value: json.value,
  }
}