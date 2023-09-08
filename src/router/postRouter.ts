import express from "express"
import { PostController } from "../controller/PostController"
import { PostBusiness } from "../business/PostBusiness"
import { PostDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { LikeDislikeDatabase } from "../database/LikeDislikeDatabase"
import { TokenManager } from "../services/TokenManager"
import { HashManager } from "../services/HashManager"

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager(),
        new LikeDislikeDatabase()
    )
)

postRouter.get("/",postController.getPosts)
postRouter.post("/",postController.createPost)
postRouter.put("/:id",postController.editPost)
postRouter.delete("/:id",postController.deletePost)

postRouter.put("/:id/like",postController.likeOrDislikePost)