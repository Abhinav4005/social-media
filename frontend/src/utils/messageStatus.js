export function getMessageStatus(message, currentUserId, roomMembers) {
    if(message.senderId !== currentUserId) return null;

    const receipts = message.receipts || [];

    const otherMembers = roomMembers.filter(member => member.userId !== currentUserId);

    if (receipts.length === 0) {
        return "sent";
    }

    const allDelivered = otherMembers.every(member => 
        receipts.some(receipt => receipt.userId === member.userId && receipt.deliveredAt)
    );

    const allRead = otherMembers.every(member => 
        receipts.some(receipt => receipt.userId === member.userId && receipt.readAt)
    )

    if(allRead) return "read";
    if(allDelivered) return "delivered";
    return "sent";
}