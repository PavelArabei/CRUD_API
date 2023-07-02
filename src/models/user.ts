export interface newUser {
  username: string
  age: number
  hobbies: string[]
}

export interface User extends newUser {
  id: string
}