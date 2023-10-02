import { PostDatabaseMock } from "../../mocks/post/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { CommentBusiness } from "../../../src/business/CommentBusinesss"
import { CommentDatabaseMock } from "../../mocks/comment/CommentDatabaseMock"
import { LikeDislikeCommentDatabaseMock } from "../../mocks/comment/LikeDislikeCommentDatabaseMock"
import { GetCommentsSchema } from "../../../src/dtos/comment/getComments.dto"
import { BaseError } from "../../../src/errors/BaseError"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"

describe("Testando getComments", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock(),
        new PostDatabaseMock(),
        new LikeDislikeCommentDatabaseMock()
    )

    test("retorna 01 array de CommentModelOutput", async () => {
        const input = GetCommentsSchema.parse({
            postId: "p002",
            token: "token-mock-fulano"
        })
        const output = await commentBusiness.getComments(input)
        expect(output).toContainEqual({
            id: "c002",
            postId: "p002",
            content: "string",
            likes: 0,
            dislikes: 0,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            creator: {
                id: "id-mock-fulano",
                name: "Fulano"
            }
        })
        expect(output).toHaveLength(1)
        expect(output).toEqual([{
            id: "c002",
            postId: "p002",
            content: "string",
            likes: 0,
            dislikes: 0,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            creator: {
                id: "id-mock-fulano",
                name: "Fulano"
            }
        }])
    })

   /*  test("retorna um array de CommentModelOutput", async () => {
        const input = GetCommentsSchema.parse({
            postId: "p001",
            token: "token-mock-fulano"
        })
        const output = await commentBusiness.getComments(input)
        expect(output).toContainEqual({
            id: "c003",
            postId: "p001",
            content: "string",
            likes: 0,
            dislikes: 0,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            creator: {
                id: "id-mock-astrodev",
                name: "Astrodev"
            }
        })
        expect(output).toHaveLength(2)
    }) */

    test("retorna a mensagem 'Token inválido'", async () => {
        expect.assertions(3)

        try {
            const input = GetCommentsSchema.parse({
                postId: "p001",
                token: "token-mock-fulanoo"
            })
            await commentBusiness.getComments(input)

        } catch (error) {
            console.log(error)
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("retorna a mensagem 'Id do post não encontrado'", async () => {
        expect.assertions(3)

        try {
            const input = GetCommentsSchema.parse({
                postId: "c001a",
                token: "token-mock-fulano"
            })
            await commentBusiness.getComments(input)

        } catch (error) {
            console.log(error)
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("Id do post não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })
})