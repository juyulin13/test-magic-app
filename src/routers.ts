/*
 * @Author: Lina
 * @Date: 2020-04-22 14:29:54
 * @LastEditors: Lina
 * @LastEditTime: 2020-06-08 20:01:11
 */ 

import { lazy } from 'react';
export default [{
  exact: true,
  path: "/editor",
  component: lazy(() => import(/* webpackChunkName: "editor" */ /* webpackPrefetch: true */ './pages/Editor'))
}
]