import { UserBusiness } from  "../../../src/business/UserBusiness"
import { LoginSchema } from "../../../src/dtos/user/login.dto"
import { HashManagerMock } from "../../mocks/services/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/user/UserDatabaseMock"

describe("Testando login", () =>{
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve gerar o token ao logar", async () =>{
        const input = LoginSchema.parse({
            email: "fulano@email.com",
            password: "fulano123"
        })

        const output = await userBusiness.login(input)
        
        expect(output).toEqual({
            message:"Login realizado com sucesso",
            token:"token-mock-fulano"
        })
    })
})