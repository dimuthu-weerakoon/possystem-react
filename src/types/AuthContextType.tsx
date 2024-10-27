export default interface AuthContextType {
    isAuthenticated: boolean;
    jwtToken: string | null;
    loading:boolean;
    signup: (jwtToken: string) => void;
    login: (jwtToken: string) => void;
    logout: () => void;

}
