// src/__tests__/api.test.ts
import { getUserProfile } from '../examples/api';
import { fetchData } from '../examples/service';

jest.mock('../examples/service', () => ({
    fetchData: jest.fn(), 
}));

test('calls fetchData with the correct URL', async () => {
    const mockedData = { name: 'John Doe' };
    const userId = '123';
    (fetchData as jest.Mock).mockResolvedValue(mockedData);
    await expect(getUserProfile(userId)).resolves.toEqual(mockedData);
    expect(fetchData).toHaveBeenCalledWith(`https://api.example.com/users/${userId}`);
});