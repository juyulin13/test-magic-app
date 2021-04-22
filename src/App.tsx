
import React, { Suspense } from 'react';

import { HashRouter as Router, Route, Switch } from 'react-router-dom'; // 如果不是多页，可以不使用react-router-dom
import './App.css';
import router from './routers';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

class App extends React.Component {

  render() {
  
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="App">
        <Suspense fallback={<div>loading</div>}>
          <Router>
            <Switch>
              {
                router.map(transformRouterConfig)
              }
            </Switch>

          </Router>
        </Suspense>
      </div>
      </DndProvider>
    );
  }
}


function transformRouterConfig(route: any) {
  const { path, routes, exact, component } = route;
  if (!routes) {
    return <Route path={path} component={component} key={path} exact={exact} onEnter={(aa: any) => {
      console.log(11, aa)
    }}/>
  }
  return (
    <Route path={path} exact={false} key={path} strict={false} onEnter={(aa: any) => {
      console.log(11, aa)
    }}>
      {routes.map(transformRouterConfig)}
    </Route>
  )
}
export default App;