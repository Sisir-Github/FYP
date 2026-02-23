import Inquiry from './inquiry.model.js'

export const createInquiry = async (payload, userId) =>
  Inquiry.create({ ...payload, user: userId || null })

export const listInquiries = async ({ page = 1, limit = 20, status }) => {
  const query = {}
  if (status) query.status = status
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Inquiry.find(query).skip(skip).limit(Number(limit)),
    Inquiry.countDocuments(query),
  ])
  return { items, total, page: Number(page), limit: Number(limit) }
}
