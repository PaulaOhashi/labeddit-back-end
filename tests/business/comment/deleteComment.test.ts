import { PostDatabaseMock } from "../../mocks/post/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { CommentBusiness } from "../../../src/business/CommentBusinesss"
import { CommentDatabaseMock } from "../../mocks/comment/CommentDatabaseMock"
import { LikeDislikeCommentDatabaseMock } from "../../mocks/comment/LikeDislikeCommentDatabaseMock"
import { BaseError } from "../../../src/errors/BaseError"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { DeleteCommentSchema } from "../../../src/dtos/comment/deleteComment.dto"

describe("Testando deleteComment", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock(),
        new PostDatabaseMock(),
        new LikeDislikeCommentDatabaseMock()
    )

    test("criador do comentário, retorna a mensagem 'Comentário deletado'", async () => {
        const input = DeleteCommentSchema.parse({
            id: "c001",
            token: "token-mock-fulano"
        })
        const output = await commentBusiness.deleteComment(input)
        expect(output).toEqual({ message: 'Comentário deletado' })
    })

    test("usuário ADMIN, retorna a mensagem 'Comentário deletado'", async () => {
        const input = DeleteCommentSchema.parse({
            id: "c003",
            token: "token-mock-astrodev"
        })
        const output = await commentBusiness.deleteComment(input)
        expect(output).toEqual({ message: 'Comentário deletado' })
    })

    test("retorna a mensagem 'Token inválido'", async () => {
        expect.assertions(3)
        
        try {
            const input = DeleteCommentSchema.parse({
                id: "c001",
                token: "token-mock-fulanoo"
            })
            await commentBusiness.deleteComment(input)

        } catch (error) {
            console.log(error)
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("retorna a mensagem 'Id do comentário não encontrado'", async () => {
        expect.assertions(3)
        
        try {
            const input = DeleteCommentSchema.parse({
                id: "c00",
                token: "token-mock-fulano"
            })
            await commentBusiness.deleteComment(input)

        } catch (error) {
            console.log(error)
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("Id do comentário não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("retorna a mensagem 'Você não possui autorização para esta ação'", async () => {
        expect.assertions(3)
        
        try {
            const input = DeleteCommentSchema.parse({
                id: "c003",
                token: "token-mock-fulano"
            })
            await commentBusiness.deleteComment(input)

        } catch (error) {
            console.log(error)
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Você não possui autorização para esta ação")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})