const request = require('supertest');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.ADMIN_USER = 'admin';
process.env.ADMIN_PASSWORD = 'password123';

// Mock del servicio para no tocar la BD
jest.mock('../src/services/admin.service', () => ({
  findAdminByUsername: jest.fn(),
  findAdminById: jest.fn(),
  createAdmin: jest.fn(),
  saveRefreshToken: jest.fn(),
  findRefreshToken: jest.fn(),
  deleteRefreshToken: jest.fn(),
}));

const adminService = require('../src/services/admin.service');
const app = require('../index');

const mockAdmin = { id: 1, username: 'admin', role: 'admin' };

describe('POST /admin/login', () => {
  beforeEach(() => jest.clearAllMocks());

  test('422 cuando faltan campos', async () => {
    const res = await request(app).post('/admin/login').send({});
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  test('422 cuando falta password', async () => {
    const res = await request(app).post('/admin/login').send({ username: 'admin' });
    expect(res.status).toBe(422);
  });

  test('401 cuando las credenciales son incorrectas', async () => {
    const res = await request(app).post('/admin/login').send({ username: 'admin', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('200 con token y refreshToken cuando las credenciales son correctas', async () => {
    adminService.findAdminByUsername.mockResolvedValue(mockAdmin);
    adminService.saveRefreshToken.mockResolvedValue();

    const res = await request(app).post('/admin/login').send({ username: 'admin', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });
});

describe('POST /admin/refresh', () => {
  test('422 cuando falta refreshToken', async () => {
    const res = await request(app).post('/admin/refresh').send({});
    expect(res.status).toBe(422);
  });

  test('401 cuando el refreshToken no está en BD', async () => {
    adminService.findRefreshToken.mockResolvedValue(null);
    const res = await request(app).post('/admin/refresh').send({ refreshToken: 'token-invalido' });
    expect(res.status).toBe(401);
  });

  test('200 con nuevo token cuando el refreshToken es válido', async () => {
    const refreshToken = jwt.sign({ id: 1 }, 'test-refresh-secret', { expiresIn: '7d' });
    adminService.findRefreshToken.mockResolvedValue({ id: 1, admin_id: 1, token: refreshToken });
    adminService.findAdminById.mockResolvedValue(mockAdmin);

    const res = await request(app).post('/admin/refresh').send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

describe('POST /admin/logout', () => {
  test('200 siempre, incluso sin refreshToken', async () => {
    adminService.deleteRefreshToken.mockResolvedValue();
    const res = await request(app).post('/admin/logout').send({});
    expect(res.status).toBe(200);
  });
});
