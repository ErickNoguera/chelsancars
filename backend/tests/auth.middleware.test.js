const jwt = require('jsonwebtoken');
const { verifyToken } = require('../src/middlewares/auth.middleware');

process.env.JWT_SECRET = 'test-secret';

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('verifyToken middleware', () => {
  const next = jest.fn();

  beforeEach(() => next.mockClear());

  test('rechaza cuando no hay Authorization header', () => {
    const req = { headers: {} };
    const res = mockRes();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rechaza cuando el formato no es Bearer', () => {
    const req = { headers: { authorization: 'Token abc123' } };
    const res = mockRes();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rechaza con 403 cuando el token es inválido', () => {
    const req = { headers: { authorization: 'Bearer token-invalido' } };
    const res = mockRes();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('rechaza con 403 cuando el token está expirado', () => {
    const expired = jwt.sign({ id: 1 }, 'test-secret', { expiresIn: -1 });
    const req = { headers: { authorization: `Bearer ${expired}` } };
    const res = mockRes();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  test('llama next() y adjunta user cuando el token es válido', () => {
    const token = jwt.sign({ id: 1, username: 'admin', role: 'admin' }, 'test-secret', { expiresIn: '1h' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: 1, username: 'admin' });
  });
});
