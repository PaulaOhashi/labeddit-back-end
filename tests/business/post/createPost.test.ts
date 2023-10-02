import { PostBusiness } from "../../../src/business/PostBusiness"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { PostDatabaseMock } from "../../mocks/post/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { LikeDislikePostDatabaseMock } from "../../mocks/post/LikeDislikePostDatabaseMock"
import { CreatePostSchema } from "../../../src/dtos/post/createPost.dto"
import { BaseError } from "../../../src/errors/BaseError"
import { BadRequestError } from "../../../src/errors/BadRequestError"

describe("Testes createPost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new LikeDislikePostDatabaseMock()
    )

    test("Deve retornar a mensagem 'post created'", async () => {
        const input = CreatePostSchema.parse({
            token: "token-mock-fulano",
            content: "Bom dia"
        })

        const output = await postBusiness.createPost(input)
        expect(output).toEqual({
            message: "post created",
            content: "Bom dia"
        })
    })

    test("Deve disparar erro e retornar mensagem 'token inválido'", async () => {
        expect.assertions(3)

        try {
            
            const input = CreatePostSchema.parse({
                token: "token",
                content: "Bom dia"
            })

            await postBusiness.createPost(input)
        } catch (error) {
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})