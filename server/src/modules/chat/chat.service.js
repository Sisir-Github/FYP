import ChatMessage from './chat.model.js'

export const listMyMessages = async (userId) => {
  await ChatMessage.updateMany(
    { user: userId, senderRole: 'ADMIN', readByUser: false },
    { $set: { readByUser: true } },
  )
  return ChatMessage.find({ user: userId }).sort({ createdAt: 1 })
}

export const sendMyMessage = async (userId, text) =>
  ChatMessage.create({
    user: userId,
    senderRole: 'USER',
    text,
    readByUser: true,
    readByAdmin: false,
  })

export const getMyUnreadCount = async (userId) => {
  const unread = await ChatMessage.countDocuments({
    user: userId,
    senderRole: 'ADMIN',
    readByUser: false,
  })
  return { unread }
}

export const listAdminUsers = async () => {
  return ChatMessage.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$user',
        lastMessage: { $first: '$text' },
        lastSenderRole: { $first: '$senderRole' },
        lastMessageAt: { $first: '$createdAt' },
        unreadForAdmin: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$senderRole', 'USER'] },
                  { $eq: ['$readByAdmin', false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        user: {
          _id: '$user._id',
          name: { $ifNull: ['$user.name', 'Traveler'] },
          email: { $ifNull: ['$user.email', '-'] },
          profileImage: { $ifNull: ['$user.profileImage', ''] },
        },
        lastMessage: 1,
        lastSenderRole: 1,
        lastMessageAt: 1,
        unreadForAdmin: 1,
      },
    },
  ])
}

export const listAdminMessages = async (userId) => {
  await ChatMessage.updateMany(
    { user: userId, senderRole: 'USER', readByAdmin: false },
    { $set: { readByAdmin: true } },
  )
  return ChatMessage.find({ user: userId }).sort({ createdAt: 1 })
}

export const sendAdminMessage = async (userId, text) =>
  ChatMessage.create({
    user: userId,
    senderRole: 'ADMIN',
    text,
    readByUser: false,
    readByAdmin: true,
  })
