import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { BaseError } from "../errors/BaseError"
import { CreatePostSchema } from "../dtos/post/createPost.dto"
import { ZodError } from "zod"
import { GetPostSchema } from "../dtos/post/getPost.dto"
import { EditPostSchema } from "../dtos/post/editPost.dto"
import { DeletePostSchema } from "../dtos/post/deletePost.dto"
import { LikeDislikePostSchema } from "../dtos/post/likeOrDislikePost.dto"

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) { }

    public createPost = async (req: Request, res: Response) => {
        try {
            const input = CreatePostSchema.parse({
                token: req.headers.authorization,
                content: req.body.content
            })

            const output = await this.postBusiness.createPost(input)

            res.status(201).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message) //aqui incluimos o método status com o código do erro correto
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public getPosts = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = GetPostSchema.parse({
                token: req.headers.authorization
            })

            const output = await this.postBusiness.getPosts(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message) //aqui incluimos o método status com o código do erro correto
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editPost = async (req: Request, res: Response) => {
        try {
            const input = EditPostSchema.parse({
                id: req.params.id,
                token: req.headers.authorization,
                content: req.body.content
            })

            const output = await this.postBusiness.editPost(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message) //aqui incluimos o método status com o código do erro correto
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deletePost = async (req: Request, res: Response) => {
        try {
            const input = DeletePostSchema.parse({
                token: req.headers.authorization,
                id: req.params.id
            })

            const output = await this.postBusiness.deletePost(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message) //aqui incluimos o método status com o código do erro correto
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likeOrDislikePost = async (req: Request, res: Response) => {
        try {
            const input = LikeDislikePostSchema.parse({
                token: req.headers.authorization,
                id: req.params.id,
                like: req.body.like
            })

            const output = await this.postBusiness.likeOrDislikePost(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message) //aqui incluimos o método status com o código do erro correto
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}