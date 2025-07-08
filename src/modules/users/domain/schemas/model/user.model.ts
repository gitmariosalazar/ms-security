import { UserTypeModel } from "src/modules/user-type/domain/schemas/model/user-type.model"

export class UserModel{
  private idUser: number
  private userEmail: string
  private userPassword: string
  private firstName: string
  private lastName: string
  private userActive: boolean
  private userType: UserTypeModel
  private createdAt: Date
  private updatedAt: Date

  constructor(
    idUser: number,
    userEmail: string,
    userPassword: string,
    firstName: string,
    lastName: string,
    userActive: boolean,
    userType: UserTypeModel,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.idUser = idUser
    this.userEmail = userEmail
    this.userPassword = userPassword
    this.firstName = firstName
    this.lastName = lastName
    this.userActive = userActive
    this.userType = userType
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  getIdUser(): number {
    return this.idUser
  }
  getUserEmail(): string {
    return this.userEmail
  }
  getUserPassword(): string {
    return this.userPassword
  }
  getFirstName(): string {
    return this.firstName
  }
  getLastName(): string {
    return this.lastName
  }
  isUserActive(): boolean {
    return this.userActive
  }
  getUserType(): UserTypeModel {
    return this.userType
  }
  getCreatedAt(): Date {
    return this.createdAt
  }
  getUpdatedAt(): Date {
    return this.updatedAt
  } 

  setIdUser(idUser: number): void {
    this.idUser = idUser
  }
  setUserEmail(userEmail: string): void {
    this.userEmail = userEmail
  }
  setUserPassword(userPassword: string): void {
    this.userPassword = userPassword
  }
  setFirstName(firstName: string): void {
    this.firstName = firstName
  }
  setLastName(lastName: string): void {
    this.lastName = lastName
  }
  setUserActive(userActive: boolean): void {
    this.userActive = userActive
  }
  setUserType(userType: UserTypeModel): void {
    this.userType = userType
  }
  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt
  }
  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt
  }
  toJSON(): object {
    return {
      idUser: this.idUser,
      userEmail: this.userEmail,
      userPassword: this.userPassword,
      firstName: this.firstName,
      lastName: this.lastName,
      userActive: this.userActive,
      userType: this.userType.toJSON(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

}