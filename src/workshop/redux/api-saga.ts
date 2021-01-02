import { SagaIterator } from 'redux-saga'
import { select, put, take } from 'redux-saga/effects'
import * as API from './api'

import DatabaseActionType = API.DatabaseActionType
type ExampleActionOne = ReturnType<typeof API.runExampleOne>

export function* exampleProgram1(action: ExampleActionOne): SagaIterator {
    const { userId } = action.payload
    let cachedPosts = yield select(API.cacheGetPosts, userId)
    if (typeof cachedPosts !== 'string') {
        yield put(API.dbGetPosts(userId))
        const { payload: { posts } } = yield take(DatabaseActionType.GET_POSTS_SUCCESS)
        yield put(API.cacheStorePosts(userId, posts))
        yield put(API.netSendPosts(posts, 'review@example.com'))
    } else {
        yield put(API.netSendPosts(JSON.parse(cachedPosts), 'review@example.com'))
    }
}
