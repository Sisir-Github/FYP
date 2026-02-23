import * as inquiryService from './inquiry.service.js'

export const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.createInquiry(
      req.body,
      req.user?.id,
    )
    res.status(201).json(inquiry)
  } catch (error) {
    next(error)
  }
}

export const listInquiries = async (req, res, next) => {
  try {
    const result = await inquiryService.listInquiries(req.query)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
