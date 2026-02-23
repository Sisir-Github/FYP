import ItineraryDay from './itinerary.model.js'

export const listItineraries = async ({ trekId }) => {
  const query = trekId ? { trek: trekId } : {}
  return ItineraryDay.find(query).sort({ dayNumber: 1 })
}

export const getItineraryById = async (id) => ItineraryDay.findById(id)

export const createItinerary = async (payload) => ItineraryDay.create(payload)

export const updateItinerary = async (id, payload) =>
  ItineraryDay.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

export const deleteItinerary = async (id) => ItineraryDay.findByIdAndDelete(id)
