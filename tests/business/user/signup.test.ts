import { ZodError } from "zod"
import { UserBusiness } from  "../../../src/business/UserBusiness"
import { SignupSchema } from "../../../src/dtos/user/signup.dto"
import { HashManagerMock } from "../../mocks/services/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/user/UserDatabaseMock"
import { BadRequestError } from "../../../src/errors/BadRequestError"

describe("Testando signup", () =>{
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve gerar o token ao cadastrar", async () =>{
        const input = SignupSchema.parse({
            name: "Ciclana",
            email: "ciclana@email.com",
            password: "ciclana321"
        })

        const output = await userBusiness.signup(input)
        
        expect(output).toEqual({
            message:"Cadastro realizado com sucesso",
            token:"token-mock"
        })
    })

    test("Deve disparar erro se o name não possuir pelo menos 2 char", async () =>{
        expect.assertions(1)

        try {
            const input = SignupSchema.parse({
                name: "",
                email: "ciclanaemail.com",
                password: "ciclana321"
            })    
        } catch (error) {
            if(error instanceof ZodError) {
                expect(error.issues[0].message).toBe("String must contain at least 2 character(s)")
            }
        }
        
    })

    test("Deve disparar erro caso email já exista", async () => {
        expect.assertions(2)

        try {
            const input = SignupSchema.parse({
                name: "Fulano",
                email: "fulano@email.com",
                password: "fulano123"
            })

            const output = await userBusiness.signup(input)
        } catch (error) {
            if(error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("'email' já existe")
            }
        }
    })
})