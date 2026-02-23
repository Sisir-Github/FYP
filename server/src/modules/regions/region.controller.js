import * as regionService from './region.service.js'

export const listRegions = async (req, res, next) => {
  try {
    const result = await regionService.listRegions(req.query)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getRegion = async (req, res, next) => {
  try {
    const region = await regionService.getRegionById(req.params.id)
    res.json(region)
  } catch (error) {
    next(error)
  }
}

export const createRegion = async (req, res, next) => {
  try {
    const region = await regionService.createRegion(req.body)
    res.status(201).json(region)
  } catch (error) {
    next(error)
  }
}

export const updateRegion = async (req, res, next) => {
  try {
    const region = await regionService.updateRegion(req.params.id, req.body)
    res.json(region)
  } catch (error) {
    next(error)
  }
}

export const deleteRegion = async (req, res, next) => {
  try {
    await regionService.deleteRegion(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
