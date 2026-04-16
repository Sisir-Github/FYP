import * as chatService from './chat.service.js'

export const getMyChatMessages = async (req, res, next) => {
  try {
    const items = await chatService.listMyMessages(req.user.id)
    res.json(items)
  } catch (error) {
    next(error)
  }
}

export const sendMyChatMessage = async (req, res, next) => {
  try {
    const item = await chatService.sendMyMessage(req.user.id, req.body.text)
    res.status(201).json(item)
  } catch (error) {
    next(error)
  }
}

export const getMyChatUnreadCount = async (req, res, next) => {
  try {
    const result = await chatService.getMyUnreadCount(req.user.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getAdminChatUsers = async (req, res, next) => {
  try {
    const items = await chatService.listAdminUsers()
    res.json(items)
  } catch (error) {
    next(error)
  }
}

export const getAdminChatMessages = async (req, res, next) => {
  try {
    const items = await chatService.listAdminMessages(req.params.userId)
    res.json(items)
  } catch (error) {
    next(error)
  }
}

export const sendAdminChatMessage = async (req, res, next) => {
  try {
    const item = await chatService.sendAdminMessage(req.params.userId, req.body.text)
    res.status(201).json(item)
  } catch (error) {
    next(error)
  }
}
