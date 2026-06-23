export interface AuthResultDto {
    token: string;
    username: string;
    fullName: string;
    roles: string[];
    permissions: string[];
}
