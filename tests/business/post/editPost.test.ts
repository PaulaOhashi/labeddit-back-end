import { PostBusiness } from "../../../src/business/PostBusiness"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { PostDatabaseMock } from "../../mocks/post/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { LikeDislikePostDatabaseMock } from "../../mocks/post/LikeDislikePostDatabaseMock"
import { CreatePostSchema } from "../../../src/dtos/post/createPost.dto"
import { BaseError } from "../../../src/errors/BaseError"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { EditPostSchema } from "../../../src/dtos/post/editPost.dto"
import { NotFoundError } from "../../../src/errors/NotFoundError"

describe("Testes editPost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new LikeDislikePostDatabaseMock()
    )

    test("deve retornar a mensagem 'Editado'", async () => {
        const input = EditPostSchema.parse({
            id: "p001",
            token: "token-mock-fulano",
            content: "Boa noite"
        })

        const output = await postBusiness.editPost(input)
        expect(output).toEqual({
            message: "Editado",
            content: "Boa noite"
        })
    })

    test("deve disparar erro e retornar mensagem 'Token inválido'", async () => {
        expect.assertions(3)

        try {
            const input = EditPostSchema.parse({
                id: "p001",
                token: "token-mock-fulanoo",
                content: "Boa noite"
            })

            await postBusiness.editPost(input)
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
            const input = EditPostSchema.parse({
                id: "p00",
                token: "token-mock-fulano",
                content: "Boa noite"
            })

            await postBusiness.editPost(input)
        } catch (error) {
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("Post com essa id não existe")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("deve disparar erro e retornar mensagem 'Somente quem criou o post pode editá-lo'", async () => {
        expect.assertions(3)

        try {
            const input = EditPostSchema.parse({
                id: "p001",
                token: "token-mock-astrodev",
                content: "Boa noite"
            })
            await postBusiness.editPost(input)
        } catch (error) {
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Somente quem criou o post pode editá-lo")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})