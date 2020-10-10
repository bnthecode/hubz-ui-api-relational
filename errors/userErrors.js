export class UserNotFound extends Error {
  constructor(message, type) {
    super(message, type);
    (this.message = "This user does not exist."), (this.type = "UserNotFound");
  }
}
export class UserExists extends Error {
  constructor(message, type) {
    super(message, type);
    (this.message = "This user already exists."), (this.type = "UserExists");
  }
}
