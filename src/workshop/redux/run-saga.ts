import { coolPost, john } from '../../domain';

import createSagaMiddleware from 'redux-saga'
import {createStore, applyMiddleware} from 'redux'
import { programReducer, interpreter, logger } from './interpreters'
import { exampleProgram1, exampleProgram2, exampleProgram3 } from './examples-saga'

(async () => {
  const sagaMiddleware = createSagaMiddleware()
  createStore(programReducer, applyMiddleware(logger, interpreter, sagaMiddleware))

  console.log('\t\t\texampleProgram1');
  await sagaMiddleware.run(exampleProgram1, { userId: john.id }).toPromise()
  console.log('\t\t\texampleProgram2');
  await sagaMiddleware.run(exampleProgram2, { post: coolPost }).toPromise()
  console.log('\t\t\texampleProgram3');
  await sagaMiddleware.run(exampleProgram3, { postId: 1, update: coolPost}).toPromise()
})()
