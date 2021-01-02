import { Post, PostUpdate } from '../../domain'


export enum KVStoreActionType {
    PUT = '[KVStore] PUT',
    DELETE = '[KVStore] DELETE',
}

export enum DatabaseActionType {
    GET_POSTS = '[DB] GET_POSTS',
    GET_POSTS_SUCCESS = '[DB] GET_POSTS_SUCCESS',
    CREATE_POST = '[DB] CREATE_POST',
    CREATE_POST_SUCCESS = '[DB] CREATE_POST_SUCCESS',
    UPDATE_POST = '[DB] UPDATE_POST',
    UPDATE_POST_SUCCESS = '[DB] UPDATE_POST_SUCCESS',
}

export enum NetActionType {
    SEND = '[NET] SEND',
    SEND_SUCCESS = '[NET] SEND_SUCCESS',
}

export enum ExampleActionType {
    ONE = '[EXAMPLE] ONE',
    ONE_DONE = '[EXAMPLE] ONE_DONE',
    TWO = '[EXAMPLE] TWO',
    TWO_DONE = '[EXAMPLE] TWO_DONE',
    THREE = '[EXAMPLE] THREE',
    THREE_DONE = '[EXAMPLE] THREE_DONE',
}

export type ProgramActionType = ExampleActionType | KVStoreActionType | DatabaseActionType | NetActionType

// selector
type ProgramState = {cache: Map<string, string>}
export const cacheGetPosts = (state: ProgramState, userId: number) => state.cache.get(`${userId}`)
// normal actions
export const cacheStorePosts = (userId: number, posts: Post[]) => <const>{type: KVStoreActionType.PUT, payload: { userId, posts }}
export const cacheInvalidate = (userId: number) => <const>{type: KVStoreActionType.DELETE, payload: { userId }}

export const dbGetPosts = (userId: number) => <const>{type: DatabaseActionType.GET_POSTS, payload: { userId }}
export const dbGetPostsSuccess = (userId: number, posts: Post[]) => <const>{type: DatabaseActionType.GET_POSTS_SUCCESS, payload: { userId, posts }}
export const dbCreatePost = (post: Post) => <const>{type: DatabaseActionType.CREATE_POST, payload: { post }}
export const dbCreatePostSuccess = (post: Post) => <const>{type: DatabaseActionType.CREATE_POST_SUCCESS, payload: { post }}
export const dbUpdatePost = (postId: number, update: PostUpdate) => <const>{type: DatabaseActionType.UPDATE_POST, payload: { postId, update }}
export const dbUpdatePostSuccess = (post: Post) => <const>{type: DatabaseActionType.UPDATE_POST_SUCCESS, payload: { post }}

export const netSendPosts = (posts: Post[], to: string) => <const>{type: NetActionType.SEND, payload: { posts, to }}
export const netSendPostsSuccess = (to: string) => <const>{type: NetActionType.SEND_SUCCESS, payload: { to }}

export const runExampleOne = (userId: number) => <const>{type: ExampleActionType.ONE, payload: { userId }}
export const doneExampleOne = () => <const>{type: ExampleActionType.ONE_DONE}
export const runExampleTwo = (newPost: Post) => <const>{type: ExampleActionType.TWO, payload: { post: newPost }}
export const doneExampleTwo = () => <const>{type: ExampleActionType.TWO_DONE}
export const runExampleThree = (postId: number, update: PostUpdate) => <const>{type: ExampleActionType.THREE, payload: { postId, update }}
export const doneExampleThree = () => <const>{type: ExampleActionType.THREE_DONE}

export type ProgramAction = ReturnType<
    | typeof cacheStorePosts
    | typeof cacheInvalidate
    | typeof dbGetPosts
    | typeof dbGetPostsSuccess
    | typeof dbCreatePost
    | typeof dbCreatePostSuccess
    | typeof dbUpdatePost
    | typeof dbUpdatePostSuccess
    | typeof netSendPosts
    | typeof netSendPostsSuccess
    | typeof runExampleOne
    | typeof doneExampleOne
    | typeof runExampleTwo
    | typeof doneExampleTwo
    | typeof runExampleThree
    | typeof doneExampleThree
>
