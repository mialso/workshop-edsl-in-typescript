import { coolPost, john } from '../../domain';

import {createStore, applyMiddleware, Store} from 'redux'
import { ProgramAction, runExampleOne, runExampleTwo, runExampleThree } from './api'
import { programReducer, interpreter, logger } from './interpreters'
import { exampleProgram1, exampleProgram2, exampleProgram3 } from './examples'

function storeResult(action: ProgramAction, store: Store): Promise<void> {
  return new Promise((resolve) => {
      const unsubscribe = store.subscribe(() => {
          const result = store.getState().result
          if (result === action.type + '_DONE') {
              unsubscribe()
              resolve()
          }
      })
      store.dispatch(action)
  })

}

(async () => {
  const store = createStore(programReducer, applyMiddleware(logger, interpreter, exampleProgram1, exampleProgram2, exampleProgram3))

  console.log('\t\t\texampleProgram1');
  await storeResult(runExampleOne(john.id), store)
  console.log('\t\t\texampleProgram2');
  await storeResult(runExampleTwo(coolPost), store)
  console.log('\t\t\texampleProgram3');
  await storeResult(runExampleThree(1, coolPost), store)
})()
