export interface MessageDto{
    id?: number
    message_content: string
    timestamp: Date
    readed: boolean
    senderUserId: number
    senderUsername: string
    receiverUserId: number
    receiverUsername: string
}