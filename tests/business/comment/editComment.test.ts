import { PostDatabaseMock } from "../../mocks/post/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { CommentBusiness } from "../../../src/business/CommentBusinesss"
import { CommentDatabaseMock } from "../../mocks/comment/CommentDatabaseMock"
import { LikeDislikeCommentDatabaseMock } from "../../mocks/comment/LikeDislikeCommentDatabaseMock"
import { EditCommentSchema } from "../../../src/dtos/comment/editComment.dto"
import { BaseError } from "../../../src/errors/BaseError"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"

describe("Testando editComment", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock(),
        new PostDatabaseMock(),
        new LikeDislikeCommentDatabaseMock()
    )

    test("retorna a mensagem 'Comentário editado'", async () => {
        const input = EditCommentSchema.parse({
            id: "c001",
            token: "token-mock-fulano",
            content: "Hello World"
        })
        const output = await commentBusiness.editComment(input)
        expect(output).toEqual({ message: 'Comentário editado' })
    })

    test("retorna a mensagem 'Token inválido'", async () => {
        expect.assertions(3)
        
        try {
            const input = EditCommentSchema.parse({
                id: "c001",
                token: "token-mock-fulanoo",
                content: "Hello world"
            })
            await commentBusiness.editComment(input)

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
            const input = EditCommentSchema.parse({
                id: "p000",
                token: "token-mock-fulano",
                content: "Hello world"
            })
            await commentBusiness.editComment(input)

        } catch (error) {
            console.log(error)
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("Id do comentário não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("retorna a mensagem 'Só quem criou pode editar o comentário'", async () => {
        expect.assertions(3)
        
        try {
            const input = EditCommentSchema.parse({
                id: "c002",
                token: "token-mock-astrodev",
                content: "Hello world"
            })
            await commentBusiness.editComment(input)

        } catch (error) {
            console.log(error)
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Só quem criou pode editar o comentário")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})