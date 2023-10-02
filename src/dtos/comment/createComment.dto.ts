import z from "zod"
import { CommentModelOutput } from "../../models/Comment" 

export interface CreateCommentInputDTO {
    post_id: string,
    token: string,
    content: string
}

export interface CreateCommentOutputDTO {
    message: string
}

export const CreateCommentSchema = z.object({
    post_id: z.string().min(1),
    token: z.string().min(1),
    content: z.string().min(1)
}).transform(data => data as CreateCommentInputDTO)