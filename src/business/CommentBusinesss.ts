import { CommentDatabase } from "../database/CommentDatabase";
import { LikeDislikeCommentDatabase } from "../database/LikeDislikeComment";
import { PostDatabase } from "../database/PostDatabase";
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/comment/createComment.dto";
import { DeleteCommentInputDTO, DeleteCommentOutputDTO } from "../dtos/comment/deleteComment.dto";
import { EditCommentInputDTO, EditCommentOutputDTO } from "../dtos/comment/editComment.dto";
import { GetCommentsInputDTO, GetCommentsOutputDTO } from "../dtos/comment/getComments.dto";
import { LikeDislikeCommentInputDTO, LikeDislikeCommentOutputDTO } from "../dtos/comment/likeDislikeComment.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Comment, CommentLikeDislikeDBModel, CommentModel, CommentModelDB } from "../models/Comment";
import { PostDB } from "../models/Post";
import { TokenPayload, USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator,
        private postDatabase: PostDatabase,
        private likeDislikeCommentDatabase: LikeDislikeCommentDatabase
    ){}

    public createComment = async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {
        const { token, content, post_id } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)
        if (payload === null) throw new BadRequestError("Token Inválido");

        const postDB: PostDB | undefined = await this.postDatabase.findPostById(post_id)
        if (!postDB) throw new NotFoundError("Post não encontrado");

        const id = this.idGenerator.generate()
        
        const newComment = new Comment(
            id,
            post_id,
            payload.id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString()
        )
        //alimentando a tabela comments DB
        await this.commentDatabase.insertCommentDB(newComment.commentToDBModel())
        //incrementando a coluna comments na tabela de posts referenciando o id do post
        await  this.postDatabase.incrementComments(newComment.getPostId())

        const output: CreateCommentOutputDTO = {
            message: "Comentário criado"
        }
        return output
    }

    public editComment = async (input: EditCommentInputDTO): Promise<EditCommentOutputDTO> => {
        const { id: commentId, token, content } = input

        //verificar se o token é válido
        const payload: TokenPayload | null = this.tokenManager.getPayload(token)
        if (payload === null) throw new BadRequestError("Token inválido");
        
        //verificar se o comentário existe no DB pelo ID
        const commentDB: CommentModelDB | undefined = await this.commentDatabase.findCommentById(commentId)
        if(!commentDB) throw new NotFoundError("Id do comentário não encontrado");
        
        //verificar se o token é do criador do comentário
        if (payload.id !== commentDB.creator_id) throw new BadRequestError("Só quem criou pode editar o comentário");
                        
        await this.commentDatabase.updateComment(content, commentId)
        
        const output: EditCommentOutputDTO = {
            message: "Comentário editado"
        }
        return output
    }

    public deleteComment = async (input: DeleteCommentInputDTO): Promise<DeleteCommentOutputDTO> => {
        const { id: commentId, token } = input

        //verificando se o token é válido
        const payload: TokenPayload | null = this.tokenManager.getPayload(token)
        if (payload === null) throw new BadRequestError("Token inválido");
        
        //verificando se o commentId existe no DB
        const commentDB: CommentModelDB | undefined = await this.commentDatabase.findCommentById(commentId)
        if (!commentDB) throw new NotFoundError("Id do comentário não encontrado");

        //verificando se o token é de ADMIN ou creator
        if (payload.id !== commentDB.creator_id && payload.role !== USER_ROLES.ADMIN) throw new BadRequestError("Você não possui autorização para esta ação");
        //deletando o comentário no DB
        await this.commentDatabase.deleteCommentById(commentId)
        //decrementando a coluna comments da tabela posts
        await this.postDatabase.decrementComments(commentDB.post_id)

        const output: DeleteCommentOutputDTO = {
            message: "Comentário deletado"
        }
        return output
    }

    public getComments = async (input: GetCommentsInputDTO): Promise<GetCommentsOutputDTO> => {
        const { postId, token } = input

        //verificando se o token é válido
        const payload: TokenPayload | null = this.tokenManager.getPayload(token)
        if (payload === null) throw new BadRequestError("Token inválido");
        //verificando se o postId existe no DB
        const postDB: PostDB = await this.postDatabase.findPostById(postId)
        if (!postDB) throw new NotFoundError("Id do post não encontrado");
        
        const commentsDB: CommentModel[] = await this.commentDatabase.getCommentsByPostId(postId)
        
        const comments: GetCommentsOutputDTO = commentsDB.map(comment => {
           return new Comment(
                comment.id,
                comment.post_id,
                comment.creator_id,
                comment.content,
                comment.likes,
                comment.dislikes,
                comment.created_at,
                comment.updated_at
            ).commentToBusinessModel(comment.creatorName)
        })

        return comments
    }

    public likeDislikeComment = async (input: LikeDislikeCommentInputDTO): Promise<LikeDislikeCommentOutputDTO> => {
        const { id: commentId, token, like } = input
        
        //verificando se token é válido
        const payload: TokenPayload | null = this.tokenManager.getPayload(token)
        if (payload === null) throw new BadRequestError("invalid token");

        //verificando se comentário existe no DB
        const commentDB: CommentModelDB | undefined = await this.commentDatabase.findCommentById(commentId)
        if (!commentDB) throw new NotFoundError("Comment Id not found");

        //convertendo o like boolean para number
        const likeDB: number = Number(like)

        //criando like_dislike_model
        const userId = payload.id
        const likeDislikeComment: CommentLikeDislikeDBModel = {
            user_id: userId,
            comment_id: commentId,
            like: likeDB
        }

        //verificando se já existe este registro de like_dislike_comment 
        const likeDislikeDB: CommentLikeDislikeDBModel | undefined = await this.likeDislikeCommentDatabase.findLikeDislike(userId, commentId)
        
        if (!likeDislikeDB) {
            //se não constar registro vamos criar    
            await this.likeDislikeCommentDatabase.insertLikeDislike(likeDislikeComment)
            //verificar se recebemos um like ou dislike para poder incrementar a tabela comments
            likeDB === 1 ?
                await this.commentDatabase.incrementLikeComment(commentId)
                : 
                await this.commentDatabase.incrementDislikeComment(commentId)
            
                const output: LikeDislikeCommentOutputDTO = "success"
                return output
        
        } else {
            //se constar o registro vamos fazer o update
            //1) verificamos se o like já registrado é diferente do enviado agora
            if (likeDB !== likeDislikeDB.like) {
                //se diferente atualizamos o DB com o like enviado
                await this.likeDislikeCommentDatabase.updateLikeDislike(likeDislikeComment)
                //e fazemos a reversão do like e dislike na tabela comments
                //se likeDB for 1 vai incrementar like e decrementar dislike e vice-versa(na tabela comments)
                likeDB === 1 ?
                await this.commentDatabase.reverseLikeUpComment(commentId)
                : 
                await this.commentDatabase.reverseDislikeUpComment(commentId)
                
                const output: LikeDislikeCommentOutputDTO = "success"
                return output

            } else {
                //se for igual deletamos o registro e decrementamos o like ou dislike na tabela comments
                await this.likeDislikeCommentDatabase.deleteLikeDislike(userId, commentId)

                likeDB === 1 ?
                    await this.commentDatabase.decrementLikeComment(commentId)
                    :
                    await this.commentDatabase.decrementDislikeComment(commentId)
                
                const output: LikeDislikeCommentOutputDTO = "success"
                return output
            }
        }
    }
}