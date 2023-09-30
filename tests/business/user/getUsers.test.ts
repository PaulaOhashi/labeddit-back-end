import { UserBusiness } from  "../../../src/business/UserBusiness"
import { GetUsersSchema } from "../../../src/dtos/user/getUsers.dto"
import { USER_ROLES } from "../../../src/models/User"
import { HashManagerMock } from "../../mocks/services/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/user/UserDatabaseMock"

describe("Testando getUsers", () =>{
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve retornar lista de users", async () =>{
        const input = GetUsersSchema.parse({
            token: "token-mock-fulano"
        })

        const output = await userBusiness.getUsers(input)
        
        expect(output).toHaveLength(2)
        expect(output).toEqual([
            {
                id:"id-mock-fulano",
                name:"Fulano",
                email:"fulano@email.com",
                createdAt: expect.any(String),
                role: USER_ROLES.NORMAL
            },
            {
                id:"id-mock-astrodev",
                name:"astrodev",
                email:"astrodev@email.com",
                createdAt: expect.any(String),
                role: USER_ROLES.ADMIN
            }
        ])
    })
})