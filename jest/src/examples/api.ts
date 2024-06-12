
// src/api.ts
import { fetchData } from '../examples/service';

export function getUserProfile(userId: string): Promise<any> {
    return fetchData(`https://api.example.com/users/${userId}`);
}