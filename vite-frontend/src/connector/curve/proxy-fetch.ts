const proxy_url = 'https://guarded-peak-87453-f4335472c9a9.herokuapp.com/'

const proxyFetch = (url: string, init?: RequestInit): Promise<Response> => {
    return fetch(`${proxy_url}${url}`, init)
}

export default proxyFetch