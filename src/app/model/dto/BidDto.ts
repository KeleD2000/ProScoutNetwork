export interface BidDto{
    bid_id?: number,
    bid_content: string,
    timestamp: Date,
    senderUserId: number
    senderUsername: string
    receiverUserId: number
    receiverUsername: string
}