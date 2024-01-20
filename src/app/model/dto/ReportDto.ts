export interface ReportDto{
    report_id?: number
    report_content: string
    timestamp: Date
    report_username: string
    senderUserId: number
    senderUsername: string
    receiverUserId: number
    receiverUsername: string
}