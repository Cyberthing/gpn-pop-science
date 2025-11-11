export const parseParams = s => s.split(',').map(p=> p.trim())
export const parseUrlQueryParams = s=> s.substr(1).split('&').map(p=>p.split('='))
