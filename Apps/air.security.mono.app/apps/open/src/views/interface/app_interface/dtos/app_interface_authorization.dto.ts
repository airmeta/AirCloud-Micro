// 应用接口授权 DTO

export interface AppInterfaceAuthorizationForm {
  id: string
  appId: string
  actionId: string
  actionSecret: string
  expiredTime: string
  externalInterfaceId: string
  description?: string | null
  deleteRemark?: string | null
}

export interface AppInterfaceAuthorizationCheckDto {
  appId: string
  actionId: string
  actionSecret: string
}

export interface AppInterfaceAuthorizationRemoveDto {
  appId: string
  actionId: string
  remark?: string | null
}
