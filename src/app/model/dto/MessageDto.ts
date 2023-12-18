export interface MessageDto{
    id?: number
    message_content: string
    dateTime: string
    readed: boolean
    senderUserId: number
    senderUserFirstName: string
    senderUserLastName: string
    receiverUserId: number
    receiverUserFirstName: string
    receiverUserLastName: string
    senderUserProfilePicture?: string
    receiverUserProfilePicture?: string
}