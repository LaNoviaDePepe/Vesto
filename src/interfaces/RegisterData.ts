import type { Profile } from "./Profile"

export interface RegisterData extends Profile {
  email: string
  password: string
}