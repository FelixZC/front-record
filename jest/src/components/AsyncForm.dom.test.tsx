// __tests__/AsyncForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AsyncForm from './AsyncForm';
import '@testing-library/jest-dom';
jest.mock('react-query');
describe('AsyncForm Component', () => {
  it('displays error when submitting with empty fields', async () => {
    render(<AsyncForm />);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
    });
  });

  it('displays success message after successful submission', async () => {
    render(<AsyncForm />);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(usernameInput, 'JohnDoe');
    userEvent.type(emailInput, 'johndoe@example.com');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/form submitted successfully/i)).toBeInTheDocument();
    });
  });

  it('disables submit button and shows submitting message during submission', async () => {
    render(<AsyncForm />);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);

    userEvent.type(usernameInput, 'JaneDoe');
    userEvent.type(emailInput, 'janedoe@example.com');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/submitting/i)).toBeInTheDocument();
    });
  });

  it('clears form and displays success message after successful submission', async () => {
    render(<AsyncForm />);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(usernameInput, 'Alice');
    userEvent.type(emailInput, 'alice@example.com');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByText(/form submitted successfully/i)).toBeInTheDocument();
    });
  });
});