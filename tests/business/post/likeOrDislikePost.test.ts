import { PostBusiness } from "../../../src/business/PostBusiness"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { PostDatabaseMock } from "../../mocks/post/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { LikeDislikePostDatabaseMock } from "../../mocks/post/LikeDislikePostDatabaseMock"
import { LikeDislikePostSchema } from "../../../src/dtos/post/likeOrDislikePost.dto"
import { BaseError } from "../../../src/errors/BaseError"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"

describe("Testes likeOrDislikePost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new LikeDislikePostDatabaseMock()
    )


    test("deve disparar erro e retornar mensagem 'Token inválido'", async () => {
        expect.assertions(3)

        try {
            const input = LikeDislikePostSchema.parse({
                id: "p001",
                token: "token-mock-fulanoo",
                like: true
            })
            await postBusiness.likeOrDislikePost(input)
        } catch (error) {
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro e retornar mensagem 'Id não encontrado'", async () => {
        expect.assertions(3)

        try {
            const input = LikeDislikePostSchema.parse({
                id: "p00",
                token: "token-mock-fulano",
                like: true
            })
            await postBusiness.likeOrDislikePost(input)
        } catch (error) {
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("Id não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })
})