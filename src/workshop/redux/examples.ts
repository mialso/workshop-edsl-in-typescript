import { Middleware } from 'redux'
import * as API from './api'

import ExampleActionType = API.ExampleActionType
import DatabaseActionType = API.DatabaseActionType
import NetActionType = API.NetActionType
import ProgramAction = API.ProgramAction

type ProgramState = {
    cache: Map<string, string>,
}

export const exampleProgram1: Middleware<{}, ProgramState> = ({ getState, dispatch }) => {
    let isRunning = false 
    return (next) => (action: ProgramAction) => {
        next(action)
        switch (action.type) {
            case ExampleActionType.ONE: {
                isRunning = true
                const { userId } = action.payload
                const cachedPosts = API.cacheGetPosts(getState)(action.payload.userId)
                if (!cachedPosts) {
                    dispatch(API.dbGetPosts(userId))
                    break
                }
                dispatch(API.netSendPosts(JSON.parse(cachedPosts), 'review@example.com'))
                break
            }
            case DatabaseActionType.GET_POSTS_SUCCESS: {
                if (!isRunning) break
                const { userId, posts } = action.payload
                dispatch(API.cacheStorePosts(userId, posts))
                dispatch(API.netSendPosts(posts, 'review@example.com'))
                break
            }
            case NetActionType.SEND_SUCCESS: {
                if (!isRunning) break
                isRunning = false
                dispatch(API.doneExampleOne())
                break
            }
            default: break
        }
    }
}

export const exampleProgram2: Middleware<{}, ProgramState> = ({ getState, dispatch }) => {
    let isRunning = false 
    return (next) => (action: ProgramAction) => {
        next(action)
        switch (action.type) {
            case ExampleActionType.TWO: {
                isRunning = true
                const { post } = action.payload
                dispatch(API.dbCreatePost(post))
                break
            }
            case DatabaseActionType.CREATE_POST_SUCCESS: {
                if (!isRunning) break
                const { post } = action.payload
                dispatch(API.dbGetPosts(post.author.id))
                break
            }
            case DatabaseActionType.GET_POSTS_SUCCESS: {
                if (!isRunning) break
                const { userId, posts } = action.payload
                const authorEmail = posts[0].author.email // wrong, should get user email by userId
                dispatch(API.netSendPosts(posts.slice(0, 3), authorEmail))
                break
            }
            case NetActionType.SEND_SUCCESS: {
                if (!isRunning) break
                isRunning = false
                dispatch(API.doneExampleTwo())
                break
            }
            default: break
        }
    }
}

export const exampleProgram3: Middleware<{}, ProgramState> = ({ dispatch }) => {
    let isRunning = false 
    return (next) => (action: ProgramAction) => {
        next(action)
        switch (action.type) {
            case ExampleActionType.THREE: {
                isRunning = true
                const { postId, update } = action.payload
                dispatch(API.dbUpdatePost(postId, update))
                break
            }
            case DatabaseActionType.UPDATE_POST_SUCCESS: {
                if (!isRunning) break
                isRunning = false 
                const { post } = action.payload
                dispatch(API.cacheInvalidate(post.author.id))
                dispatch(API.doneExampleThree())
                break
            }
            default: break
        }
    }
}
