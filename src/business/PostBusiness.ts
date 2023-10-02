import { LikeDislikeDatabase } from "../database/LikeDislikeDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto"
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/post/deletePost.dto"
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto"
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPost.dto"
import { LikeDislikePostInputDTO, LikeDislikePostOutputDTO } from "../dtos/post/likeOrDislikePost.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { LikeDislikeDB, Post, PostDB } from "../models/Post"
import { USER_ROLES } from "../models/User"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"


export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,       
        private likeDislikeDatabase: LikeDislikeDatabase
    ) { }

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        const { token, content } = input
        //Token do usuario
        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        const id = this.idGenerator.generate()

        const newPost = new Post(
            id,
            payload.id,
            content,
            0,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString()
        )

        const newPostDB: PostDB = newPost.postToDBModel()
        await this.postDatabase.insertPost(newPostDB)

        const output: CreatePostOutputDTO = {
            message:"post created",
            content: content
        }

        return output
    }

    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {
        const { token } = input

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("Token inválido")
        }

        const postsDB = await this.postDatabase.findPosts()

        const posts: GetPostsOutputDTO = postsDB.map((postDB) => {
            const post = new Post(
                postDB.id,
                postDB.creator_id,
                postDB.content,
                postDB.likes,
                postDB.dislikes,
                postDB.comments,
                postDB.created_at,
                postDB.updated_at
            )
            return post.postToBusinessModel(postDB.creator_id, postDB.creatorName)
        })

        const output = posts

        return output
    }

    public editPost = async (input: EditPostInputDTO): Promise<EditPostOutputDTO> => {
        const { id, token, content } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("Token inválido")
        }

        const postDB = await this.postDatabase.findPostById(id)

        if (!postDB) {
            throw new NotFoundError("Post com essa id não existe")
        }

        if (payload.id !== postDB.creator_id) {
            throw new BadRequestError("Somente quem criou o post pode editá-lo")
        }

        const post = new Post(
            postDB.id,
            postDB.creator_id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.comments,
            postDB.created_at,
            postDB.updated_at
        )

        post.setContent(content)

        const updatedPostDB = post.postToDBModel()
        await this.postDatabase.updatedPost(updatedPostDB)

        const output: EditPostOutputDTO = {
            message:"Editado",
            content: content
        }

        return output
    }

    public deletePost = async (input: DeletePostInputDTO): Promise<DeletePostOutputDTO> => {
        const { token, id } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("Token inválido")
        }

        const postDB = await this.postDatabase.findPostById(id)

        if (!postDB) {
            throw new NotFoundError("Post com essa id não existe")
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            if (payload.id !== postDB.creator_id) {
                throw new BadRequestError("Não autorizado!")
            }
        } 

        await this.postDatabase.deletePostById(id)

        const output: DeletePostOutputDTO = {
            message: "Post deletado"
        }
        return output

    }

    public likeOrDislikePost = async (input: LikeDislikePostInputDTO) => {
        const { id, token, like } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("Token inválido")
        }

        const postDB: PostDB | undefined = await this.postDatabase.findPostById(id)
        if (!postDB) {
            throw new NotFoundError("Id não encontrado");
        }

        const { creator_id } = postDB
        const { id: user_id } = payload
        if (creator_id === user_id) {
            throw new BadRequestError("O criador da postagem não pode fazer esta ação!");
        }

        const likePost: number = Number(like)

        const like_dislike: LikeDislikeDB = {
            user_id,
            post_id: id,
            like: likePost
        }

        const likesDislikesExists: LikeDislikeDB | undefined = await this.likeDislikeDatabase.findLikesDislikes(id, payload.id)

        if (!likesDislikesExists) {
            await this.likeDislikeDatabase.createLikesDislikes(like_dislike)

            likePost === 1 ?
                await this.postDatabase.incrementLike(id) :
                await this.postDatabase.incrementDislike(id)

        } else {
            if (likesDislikesExists.like === likePost) {
                await this.likeDislikeDatabase.deleteLikesDislikes(user_id, id)
                likePost === 1 ?
                    await this.postDatabase.decrementLike(id) : await this.postDatabase.decrementDislike(id)
            } else {
                await this.likeDislikeDatabase.updateLikesDislikes(like_dislike)
                likePost === 1 ?
                    await this.postDatabase.reverseLikeUp(id) :
                    await this.postDatabase.reverseDislikeUp(id)
            }
        }

        const output: LikeDislikePostOutputDTO = "ok"
        return output
    }
}