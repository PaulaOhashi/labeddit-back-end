import { PostDatabaseMock } from "../../mocks/post/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { CommentBusiness } from "../../../src/business/CommentBusinesss"
import { CommentDatabaseMock } from "../../mocks/comment/CommentDatabaseMock"
import { LikeDislikeCommentDatabaseMock } from "../../mocks/comment/LikeDislikeCommentDatabaseMock"
import { CreateCommentSchema } from "../../../src/dtos/comment/createComment.dto"
import { BaseError } from "../../../src/errors/BaseError"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"

describe("Testando createComment", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock(),
        new PostDatabaseMock(),
        new LikeDislikeCommentDatabaseMock()
    )

    test("retorna a mensagem 'Comentário criado'", async () => {
        const input = CreateCommentSchema.parse({
            post_id: "p002",
            token: "token-mock-fulano",
            content: "Hello World"
        })
        const output = await commentBusiness.createComment(input)
        expect(output).toEqual({ message: 'Comentário criado' })
    })

     test("retorna a mensagem 'Token Inválido'", async () => {
        expect.assertions(3)
        
        try {
            const input = CreateCommentSchema.parse({
                post_id: "p002",
                token: "token-mock-fulanoo",
                content: "Hello World"
            })
            await commentBusiness.createComment(input)

        } catch (error) {
            console.log(error)
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Token Inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("retorna a mensagem 'Post não encontrado'", async () => {
        expect.assertions(3)
        
        try {
            const input = CreateCommentSchema.parse({
                post_id: "p00",
                token: "token-mock-fulano",
                content: "Hello World"
            })
            await commentBusiness.createComment(input)

        } catch (error) {
            console.log(error)
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("Post não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    }) 
})