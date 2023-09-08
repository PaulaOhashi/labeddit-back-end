import z from 'zod'
import { PostModelDBOutput } from '../../models/Post'

export interface GetPostsInputDTO {
    token: string
}

export type GetPostsOutputDTO = PostModelDBOutput[]

export const GetPostSchema = z.object({
    token: z.string()
}).transform(data => data as GetPostsInputDTO)