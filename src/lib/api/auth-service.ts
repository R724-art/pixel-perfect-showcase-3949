export interface Recruiter {
  name: string;
  company: string;
  email: string;
}

export interface AuthService {
  login(email: string, password: string): Promise<Recruiter>;
  register(name: string, company: string, email: string, password: string): Promise<Recruiter>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<Recruiter>;
}

const demoRecruiter: Recruiter = { name: "Dana Okafor", company: "Meridian Studio", email: "dana@meridian.example" };

export const authService: AuthService = {
  async login(email) { return { ...demoRecruiter, email: email || demoRecruiter.email }; },
  async register(name, company, email) { return { name, company, email }; },
  async logout() {},
  async getCurrentUser() { return demoRecruiter; },
};
