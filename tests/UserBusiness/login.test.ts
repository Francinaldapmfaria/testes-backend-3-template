import { UserBusiness } from "../../src/business/UserBusiness"
import { LoginInputDTO, SignupInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("login", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("login bem-sucedido em conta normal retorna token", async () => {
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("login bem-sucedido em conta admin retorna token", async () => {
        const input: LoginInputDTO = {
            email: "admin@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-admin")
    })

    test("deve disparar erro caso email não seja uma string",async ( )=> {
        expect.assertions(1)
        try {
            const input: LoginInputDTO = {
                email: null,
                password: "bananinha"
            }


             await userBusiness.login(input)

        } catch (error) {
            
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'email' deve ser string")
                
            }
        }
    })

    test("deve disparar erro caso email não seja encontrado",async ( )=> {
        expect.assertions(1)
        try {
            const input: LoginInputDTO = {
                email: "folr@rmail.com",
                password: "bananinha"
            }


             await userBusiness.login(input)

        } catch (error) {
            
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'email' não cadastrado")
                
            }
        }
    })

    test("deve disparar erro caso password incorreto",async ( )=> {
        expect.assertions(1)
        try {
            const input: LoginInputDTO = {
                email: "normal@email.com",
                password: "123456"
            }


             await userBusiness.login(input)

        } catch (error) {
            
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'password' incorreto")
                
            }
        }
    })

})