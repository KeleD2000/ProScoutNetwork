export interface LoginResponse {
    accountNonExpired: boolean
    accountNonLocked: boolean
    authorities: [
        {
            authority : string
        }
    ]
    credentialsNonExpired : boolean
    enabled : boolean
    password : null
    username : string
}