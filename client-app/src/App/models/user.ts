export interface User {
      username: string;
      displayName: string;
      token: string;
      image?: string;
}

// Clever way of setting up the form values here. We made the displayname and username both optional so we can use the same interface for the form as well in the registration form
export interface UserFormValues {
      email: string;
      password: string;
      displayName?: string;
      username?: string;
}