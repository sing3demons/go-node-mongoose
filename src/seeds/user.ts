import { faker } from '@faker-js/faker'
import { connectToDB } from '../db'
import { UserModel } from '../schema/user'
import { IUser } from '../model/user'

function createRandomUser(): IUser {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthDate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  }
}

function mockUsers() {
  return new Promise((resolve, reject) => {
    const USERS: IUser[] = faker.helpers.multiple(createRandomUser, {
      count: 100000,
    })

    resolve(USERS)
  })
}

async function insertUsers() {
  try {
    await connectToDB()
    const body = (await mockUsers()) as IUser[]
    console.log('inserting', body.length, 'users')
    const users = await UserModel.insertMany<IUser>(body)
    console.log(users.length, 'users inserted')
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

insertUsers().then(() => {
  process.exit(0)
})
