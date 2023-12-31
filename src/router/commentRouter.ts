import express from 'express'
import { CommentController } from '../controller/CommentController'
import { CommentBusiness } from '../business/CommentBusinesss'
import { CommentDatabase } from '../database/CommentDatabase'
import { TokenManager } from '../services/TokenManager'
import { IdGenerator } from '../services/IdGenerator'
import { PostDatabase } from '../database/PostDatabase'
import { LikeDislikeCommentDatabase } from '../database/LikeDislikeComment'



export const commentRouter = express.Router()

const commentController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new TokenManager(),
        new IdGenerator(),
        new PostDatabase(),
        new LikeDislikeCommentDatabase()
    )
)

/********** Endpoints Comments ***********/

/*=================== Create Comment =========================*/
commentRouter.post("/:id", commentController.createComment)
/*=================== Edit Comment =========================*/
commentRouter.put("/:id", commentController.editComment)
/*=================== Delete Comment =========================*/
commentRouter.delete("/:id", commentController.deleteComment)
/*=================== Get Comment =========================*/
commentRouter.get("/:id", commentController.getComments)
/*=================== Like and Dislike Comment =========================*/
commentRouter.put("/:id/like", commentController.likeDislikeComment)