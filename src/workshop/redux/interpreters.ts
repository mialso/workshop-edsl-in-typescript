import { Middleware } from 'redux'

import * as API from './api'
import { DBPost, john } from '../../domain';

import KVStoreActionType = API.KVStoreActionType
import DatabaseActionType = API.DatabaseActionType
import NetActionType = API.NetActionType
import ExampleActionType = API.ExampleActionType
import ProgramAction = API.ProgramAction

type ProgramState = {
    cache: Map<string, string>,
    result: ExampleActionType | null,
}

export const initialState: ProgramState = {
    cache: new Map<string, string>(), // not correct, should be immutable, reason: example consistence
    result: null,
}
export const programReducer = (state: ProgramState = initialState, action: ProgramAction): ProgramState => {
    switch (action.type) {
        case KVStoreActionType.PUT: {
            const { userId, posts } = action.payload
            state.cache.set(`${userId}`, JSON.stringify(posts))
            return {
                ...state,
            }
        }
        case KVStoreActionType.DELETE: {
            const { userId } = action.payload
            state.cache.delete(`${userId}`)
            return {
                ...state,
            }
        }
        case ExampleActionType.ONE_DONE:
        case ExampleActionType.TWO_DONE:
        case ExampleActionType.THREE_DONE: {
            return {
                ...state,
                result: action.type,
            }
        }
        default: return state
    }
}

export const interpreter: Middleware<{}, ProgramState> = ({ dispatch }) => {
    const dbFake: Record<number, Record<number, DBPost>> = {
        1: {
          1: { id: 1, title: 'First post', body: 'Look at this <b>cooool</b> post', tags: ['cool'], author: john },
          2: { id: 2, title: 'Second post', body: 'Look at this even <b>cooooler</b> post', tags: ['cool'], author: john },
        },
    }
    return (next) => (action: ProgramAction) => {
        next(action)
        switch (action.type) {
            case DatabaseActionType.GET_POSTS: {
                const { userId } = action.payload
                setTimeout(() => {
                    const posts = Object.values(dbFake[userId])
                    dispatch(API.dbGetPostsSuccess(userId, posts))
                }, 400)
                break
            }
            case DatabaseActionType.CREATE_POST: {
                const { post } = action.payload
                const userPostDb = dbFake[post.author.id];
                const id = Math.max(...Object.keys(userPostDb).map(k => +k)) + 1;
                const newPost = { ...post, id };
                dbFake[post.author.id][id] = newPost;
                dispatch(API.dbCreatePostSuccess(newPost))
                break
            }
            case DatabaseActionType.UPDATE_POST: {
                const { postId, update } = action.payload
                const existingPost = dbFake[update.author.id][postId]
                if (!existingPost) {
                    break
                }
                const updatedPost = { ...existingPost, ...update };
                dbFake[update.author.id][existingPost.id] = updatedPost;
                dispatch(API.dbUpdatePostSuccess(updatedPost))
                break
            }
            case NetActionType.SEND: {
                const { to } = action.payload
                setTimeout(() => {
                    dispatch(API.netSendPostsSuccess(to))
                }, 1500)
                break
            }
            default: break
        }
    }
}

export const logger: Middleware<{}, ProgramState> = ({ getState }) => (next) => (action: ProgramAction) => {
    console.log(`${action.type}::`, JSON.stringify({ ...getState(), ...action }))
    next(action)
}
