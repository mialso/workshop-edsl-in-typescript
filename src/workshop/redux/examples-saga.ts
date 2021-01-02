import { SagaIterator } from 'redux-saga'
import { select, put, take } from 'redux-saga/effects'

import * as API from './api'
import { Post, PostUpdate } from '../../domain'

import DatabaseActionType = API.DatabaseActionType

export function* exampleProgram1({ userId }: { userId: number }): SagaIterator {
    let cachedPosts = yield select(API.cacheGetPosts, userId)
    if (typeof cachedPosts !== 'string') {
        yield put(API.dbGetPosts(userId))
        const { payload: { posts } } = yield take(DatabaseActionType.GET_POSTS_SUCCESS)
        yield put(API.cacheStorePosts(userId, posts))
        yield put(API.netSendPosts(posts, 'review@example.com'))
    } else {
        yield put(API.netSendPosts(JSON.parse(cachedPosts), 'review@example.com'))
    }
    yield take(API.netSendPostsSuccess)
}

export function* exampleProgram2({ post }: { post: Post }): SagaIterator {
    yield put(API.dbCreatePost(post))
    const { payload } = yield take(DatabaseActionType.CREATE_POST_SUCCESS)
    yield put(API.dbGetPosts(payload.post.author.id))
    const { payload: { posts } } = yield take(DatabaseActionType.GET_POSTS_SUCCESS)
    const authorEmail = posts[0].author.email
    yield put(API.netSendPosts(posts.slice(0, 3), authorEmail))
    yield take(API.netSendPostsSuccess)
}

export function* exampleProgram3(input: { postId: number, update: PostUpdate }): SagaIterator {
    const { postId, update } = input
    yield put(API.dbUpdatePost(postId, update))
    const { payload: { post } } = yield take(DatabaseActionType.UPDATE_POST_SUCCESS)
    yield put(API.cacheInvalidate(post.author.id))
}
