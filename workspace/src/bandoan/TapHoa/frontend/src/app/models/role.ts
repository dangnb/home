export interface Role {
    id: number;
    name: string;
    description: string;
    permissions: number; // Bitmask value
}
