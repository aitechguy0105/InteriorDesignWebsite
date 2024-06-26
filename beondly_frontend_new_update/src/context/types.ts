export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type RegisterParams = {
  username: string
  email: string
  password: string
}

export type FrogotPasswordParams = {
  email: string
}

export type ResetPasswordParamse = {
  password: string
  accessToken: string | null
}

export type VerifyemailParams = {
  tokenParam: string | null
}

export type UserDataType = {
  avatar: string | undefined
  id: number
  name: string
  email: string
  firstname: string
  lastname: string
  genNumber: number
  verifyemail: boolean
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  forgotpassword: (params: FrogotPasswordParams, errorCallback?: ErrCallbackType) => void
  resetpassword: (params: ResetPasswordParamse, errorCallback?: ErrCallbackType) => void
  verifyemail: (params: VerifyemailParams, errorCallback?: ErrCallbackType) => void
}

export type RoomType = {
  value: string
  title: string
  nameId: number
}

export type UsersType = {
  id: number
  name: string
  email: string
  firstname: string
  lastname: string
  genNumber: number
  paymentAmount: number
  address: string
  phoneNumber: string
  currentPlan: string
  role: string
  status: string
  verifyemail: boolean
  avatar: string
  createdAt: string
  updatedAt: string
  lastlogindate: string
}

export interface ProjectInterface {
  id: number
  name: string
  userId: number
  prompt: string
  baseUrl: string
  url: string[]
  createdAt: string
  method: 'restyle' | 'staging'
}

export interface updateProfileInterface {
  lastname: string
  firstname: string
  address: string
  phoneNumber: string
}

// interface
export interface ValidateInterface {
  upper: boolean
  lower: boolean
  number: boolean
  special: boolean
  length: boolean
}

export interface profileValidationInterface {
  firstName: boolean
  lastName: boolean
  address: boolean
  phoneNumber: boolean
}

export interface imageSizeInterface {
  width: number
  height: number
}

export type DateType = Date | null | undefined
