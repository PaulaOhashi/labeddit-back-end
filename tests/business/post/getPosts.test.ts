import { PostBusiness } from "../../../src/business/PostBusiness"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { PostDatabaseMock } from "../../mocks/post/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { LikeDislikePostDatabaseMock } from "../../mocks/post/LikeDislikePostDatabaseMock"
import { CreatePostSchema } from "../../../src/dtos/post/createPost.dto"
import { BaseError } from "../../../src/errors/BaseError"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { GetPostSchema } from "../../../src/dtos/post/getPost.dto"

describe("Testes getPosts", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new LikeDislikePostDatabaseMock()
    )

    test("Deve retornar um array com os posts", async () => {
        
        const input = GetPostSchema.parse({
            token: "token-mock-fulano"
        })
        const output = await postBusiness.getPosts(input)
        expect(output).toHaveLength(2)
    })

    test("Deve retornar erro 'Token inválido'", async () => {
        expect.assertions(3)

        try {
            const input = GetPostSchema.parse({
                token: "token-mock-fulanoo"
            })
            await postBusiness.getPosts(input)
        } catch (error) {
            expect(error).toBeInstanceOf(BaseError)
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})