import * as itineraryService from './itinerary.service.js'

export const listItineraries = async (req, res, next) => {
  try {
    const items = await itineraryService.listItineraries(req.query)
    res.json(items)
  } catch (error) {
    next(error)
  }
}

export const getItinerary = async (req, res, next) => {
  try {
    const item = await itineraryService.getItineraryById(req.params.id)
    res.json(item)
  } catch (error) {
    next(error)
  }
}

export const createItinerary = async (req, res, next) => {
  try {
    const item = await itineraryService.createItinerary(req.body)
    res.status(201).json(item)
  } catch (error) {
    next(error)
  }
}

export const updateItinerary = async (req, res, next) => {
  try {
    const item = await itineraryService.updateItinerary(req.params.id, req.body)
    res.json(item)
  } catch (error) {
    next(error)
  }
}

export const deleteItinerary = async (req, res, next) => {
  try {
    await itineraryService.deleteItinerary(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
