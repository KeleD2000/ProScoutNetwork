export interface MessageDto{
    id?: number
    message_content: string
    timestamp: Date
    senderUserId: number
    senderUsername: string
    receiverUserId: number
    anotherReceiverUserId?: number
    receiverUsername: string
    groupChat?: number;
}