import { PostBusiness } from "../../../src/business/PostBusiness"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { PostDatabaseMock } from "../../mocks/post/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { LikeDislikePostDatabaseMock } from "../../mocks/post/LikeDislikePostDatabaseMock"
import { DeletePostSchema } from "../../../src/dtos/post/deletePost.dto"
import { BaseError } from "../../../src/errors/BaseError"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { EditPostSchema } from "../../../src/dtos/post/editPost.dto"
import { NotFoundError } from "../../../src/errors/NotFoundError"

describe("Testes deletePost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new LikeDislikePostDatabaseMock()
    )

    test("deve retornar a mensagem 'Post deletado'", async () => {
        const input = DeletePostSchema.parse({
            id: "p001",
            token: "token-mock-fulano"
        })
        const output = await postBusiness.deletePost(input)
        expect(output).toEqual({message: "Post deletado"})
    })

    test("deve disparar erro e retornar mensagem 'Token inválido'", async () => {
        expect.assertions(3)

        try {
            const input = DeletePostSchema.parse({
                id: "p001",
                token: "token-mock-fulanoo"
            })
            await postBusiness.deletePost(input)
        } catch (error) {
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro e retornar mensagem 'Post com essa id não existe'", async () => {
        expect.assertions(3)

        try {
            const input = DeletePostSchema.parse({
                id: "p00",
                token: "token-mock-astrodev"
            })
            await postBusiness.deletePost(input)
        } catch (error) {
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("Post com essa id não existe")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("deve disparar erro e retornar mensagem 'Não autorizado!'", async () => {
        expect.assertions(3)

        try {
            const input = DeletePostSchema.parse({
                id: "p002",
                token: "token-mock-fulano"
            })
            await postBusiness.deletePost(input)
        } catch (error) {
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Não autorizado!")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})