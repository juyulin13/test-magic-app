
import { mock}  from './mock';
export interface Service {
  title: string;
  url: string;
  method: string;
  requestArgs?: {
    query?: any;
    body?: any
  },
  responseBody: any
}
export function createService() {
  
}

export function createMockService(service: Service) {
  return (data: any) => {
    return Promise.resolve({
      code: 0,
      data: mock(service.responseBody)
    })
  }
}