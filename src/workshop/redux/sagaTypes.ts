import type { AnyAction } from 'redux'
import { select, put, take, PutEffect, TakeEffect, SelectEffect } from 'redux-saga/effects'
import * as API from './api'

import ProgramAction = API.ProgramAction
type ExampleActionOne = ReturnType<typeof API.runExampleOne>

type DatabaseGetPostsSuccess = ReturnType<typeof API.dbGetPostsSuccess>
type ProgramState = {
    cache: Map<string, string>,
}
type SelectedPosts = ReturnType<typeof API.cacheGetPosts>

type SagaIteratorMy<S, A extends AnyAction> = Iterator<
    PutEffect<A> | TakeEffect | SelectEffect,
    void,
    DatabaseGetPostsSuccess | SelectedPosts>

// export function* exampleProgram1(action: ExampleActionOne): SagaIteratorMy<ProgramState, ProgramAction> {
