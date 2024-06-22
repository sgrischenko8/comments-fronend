import { UserType } from '../@types/custom';

export class User {
  id?: number;
  userName: string;
  email: string;
  homePage?: string | URL;

  constructor(
    userName: string,
    email: string,
    homePage?: string | URL,
    id?: number,
  ) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.homePage = homePage;
  }

  static fromFormValues(values: {
    userName: string;
    email: string;
    homePage?: string;
  }): User {
    return new User(values.userName, values.email, values.homePage);
  }

  static fromUserType(userType: UserType): User {
    return new User(
      userType.userName,
      userType.email,
      userType.homePage,
      userType.id,
    );
  }
}
