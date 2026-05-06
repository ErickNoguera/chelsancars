import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginForm from '../components/LoginForm';

vi.mock('../services/api', () => ({
  login: vi.fn(),
}));

import { login } from '../services/api';

describe('LoginForm', () => {
  const onLoginExitoso = vi.fn();
  const onVolver = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza los campos de usuario y contraseña', () => {
    render(<LoginForm onLoginExitoso={onLoginExitoso} onVolver={onVolver} />);
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  test('muestra error cuando se envía el formulario vacío', async () => {
    render(<LoginForm onLoginExitoso={onLoginExitoso} onVolver={onVolver} />);
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(await screen.findByText(/ingresa tu usuario y contraseña/i)).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  test('llama a login con las credenciales correctas', async () => {
    login.mockResolvedValue({ data: { token: 'tok', refreshToken: 'ref' } });
    render(<LoginForm onLoginExitoso={onLoginExitoso} onVolver={onVolver} />);

    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('admin', 'password123'));
    expect(onLoginExitoso).toHaveBeenCalledWith('tok', 'ref');
  });

  test('muestra error cuando las credenciales son incorrectas', async () => {
    login.mockRejectedValue({ response: { status: 401 } });
    render(<LoginForm onLoginExitoso={onLoginExitoso} onVolver={onVolver} />);

    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(await screen.findByText(/usuario o contraseña incorrectos/i)).toBeInTheDocument();
  });
});
