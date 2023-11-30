

export type ITokenPayload = {
    userId: string,
    username: string,
    role: string,
    isSecondFactorAuthenticated?:boolean
}