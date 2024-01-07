export interface MessageDto{
    id?: number
    message_content: string
    dateTime: string
    readed: boolean
    senderUserId: number
    senderUsername: string
    receiverUserId: number
    receiverUsername: string
}