export class PermissionModel {
  private idPermission: number;
  private name: string;
  private description: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    idPermission: number,
    name: string,
    description: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.idPermission = idPermission;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getIdPermission(): number {
    return this.idPermission;
  }
  getName(): string {
    return this.name;
  }
  getDescription(): string {
    return this.description;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }
  setIdPermission(idPermission: number): void {
    this.idPermission = idPermission;
  }
  setName(name: string): void {
    this.name = name;
  }
  setDescription(description: string): void {
    this.description = description;
  }
  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }
  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }
  toJSON(): Object {
    return {
      idPermission: this.idPermission,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

}