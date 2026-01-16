import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId?: string;
    schoolSlug?: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    schoolId?: string;
    schoolSlug?: string;
  }
}
