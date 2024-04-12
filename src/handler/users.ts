import { Request, Response } from 'express'
import { UserModel } from '../schema/user'
import { IUser } from '../model/user'

async function findUsers(req: Request, res: Response) {
  try {
    const filter = { deleteDate: null }
    const projection = { deleteDate: 0 }
    const limit: number = (req?.query?.limit && Number(req?.query?.limit)) || 10
    const skip: number = (req?.query?.skip && Number(req?.query?.skip)) || 0
    const users = await UserModel.find<IUser>(filter, projection, {
      limit: limit,
      skip: skip,
      sort: { createdAt: -1 },
    }).select({ __v: 0 })
    res.json(users)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

async function createUser(req: Request, res: Response) {
  try {
    const user = new UserModel(req.body)
    const result = await user.save()
    res.json(result)
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export default { findUsers, createUser }
