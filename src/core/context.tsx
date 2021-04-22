import { createContext, useMemo, useState } from 'react';
import { Subject, Observable } from 'rxjs';

interface Action {
  type: string;
  payload: any;
  [key: string]: any
}

let id = 1;

const ScopeContext = createContext<ScopeStore>(null)


class ScopeStore {
  subjectStore: any[]
  constructor() {
    this.subjectStore = [];
    
  }
  mountObservable = (sourceId: string) => {
    id++
    let subject = new Subject();
    this.subjectStore.push({
      id,
      subject
    })
    return subject;
  }
  unmountObservable = unmountId => {
    this.subjectStore = this.subjectStore.filter(({id}) => unmountId !== id)
  }
}

export const ScopeContextProvider: React.FC<{}> = (props) => {
  const scopeStore = useMemo(() => {
    return new ScopeStore()
  }, [])
  return (
    <ScopeContext.Provider value={scopeStore}>
      {props.children}
    </ScopeContext.Provider>

  )
}


