import { Player } from "./Player"
import { Role } from "./Roles"
import { Scout } from "./Scout"

export interface User{
    id?: number
    username: string
    password: string,
    profilePictureName: string,
    roles: Role[]
    player: Player,
    scout: Scout
}