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
  updateProfile(profile: Recruiter): Promise<Recruiter>;
}

const demoRecruiter: Recruiter = { name: "Dana Okafor", company: "Meridian Studio", email: "dana@meridian.example" };
let currentRecruiter = { ...demoRecruiter };

export const authService: AuthService = {
  async login(email) { currentRecruiter = { ...currentRecruiter, email: email || demoRecruiter.email }; return { ...currentRecruiter }; },
  async register(name, company, email) { currentRecruiter = { name, company, email }; return { ...currentRecruiter }; },
  async logout() { currentRecruiter = { ...demoRecruiter }; },
  async getCurrentUser() { return { ...currentRecruiter }; },
  async updateProfile(profile) { currentRecruiter = { ...profile }; return { ...currentRecruiter }; },
};
