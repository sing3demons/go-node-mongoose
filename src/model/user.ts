export interface IUser {
  userId: string
  username: string
  email?: string
  avatar?: string
  password: string
  birthDate?: Date
  registeredAt?: Date
  deleteDate?: Date | null
}

interface Profile {
    name: string
    email: string
    avatar: string
    
}
