export class UserTypeModel {
  private idUserType: number;
  private name: string;
  private description?: string;
  private createdAt: Date;
  private updatedAt: Date;

  /**
   * Creates an instance of UserTypeModel.
   * @param {string} idUserType - The unique identifier for the user type.
   * @param {string} name - The name of the user type.
   * @param {string} [description] - A brief description of the user type.
   */
  constructor(idUserType: number, name: string, description?: string) {
    this.idUserType = idUserType;
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  getIdUserType(): number {
    return this.idUserType;
  }

  getName(): string {
    return this.name;
  }
  getDescription(): string | undefined {
    return this.description;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }
  setDescription(description: string | undefined): void {
    this.description = description;
    this.updatedAt = new Date();
  }
  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }
  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }
  setIdUserType(idUserType: number): void {
    this.idUserType = idUserType;
  }

  toJSON(): Object {
    return {
      idUserType: this.idUserType,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
