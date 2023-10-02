import z from "zod"
import { PostModelDBOutput } from "../../models/Post"

export interface EditPostInputDTO {
    id: string,
    token: string,
    content: string
}

export interface EditPostOutputDTO {
    message:string,
    content:string
}

export const EditPostSchema = z.object({
    id: z.string().min(1),
    token: z.string().min(1),
    content: z.string().min(1)
}).transform(data => data as EditPostInputDTO)