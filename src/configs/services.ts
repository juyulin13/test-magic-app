import { Service } from '../core/weiget/service'
const queryUsers: Service = {
  title: '查询用户列表',
  url: '/users/query',
  method: 'post',
  requestArgs: {
    body: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      }
    }
  },
  responseBody: {
    type: 'object',
    properties: {
      records: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              title: '姓名',
              type: 'string',
              format: 'cname'
            },
            age: {
              title: '年龄',
              type: 'number'
            }
          }
        }
      }
    }
  }
}

export default {
  queryUsers
}