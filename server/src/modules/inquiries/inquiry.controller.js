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

export const getInquiry = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.getInquiryById(req.params.id)
    res.json(inquiry)
  } catch (error) {
    next(error)
  }
}

export const updateInquiry = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.updateInquiry(req.params.id, req.body)
    res.json(inquiry)
  } catch (error) {
    next(error)
  }
}

export const deleteInquiry = async (req, res, next) => {
  try {
    await inquiryService.deleteInquiry(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
