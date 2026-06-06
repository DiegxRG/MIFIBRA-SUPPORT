import { http, HttpResponse, delay } from 'msw';
import { MOCK_USERS } from '../data/mockUsers';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const authHandlers = [
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    await delay(1000); // Simulate network latency
    const body = (await request.json()) as any;

    const user = MOCK_USERS.find(
      (u) => u.email === body.email && u.password === body.password
    );

    if (!user) {
      return HttpResponse.json(
        { message: 'Credenciales incorrectas', success: false },
        { status: 401 }
      );
    }

    const { password, ...userWithoutPassword } = user;

    return HttpResponse.json(
      {
        user: userWithoutPassword,
        token: `mock-jwt-token-${Date.now()}`,
        expiresIn: 3600,
        success: true,
      },
      { status: 200 }
    );
  }),
];
