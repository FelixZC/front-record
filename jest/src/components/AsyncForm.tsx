// components/AsyncForm.tsx
import React, { useState } from 'react';

interface FormValues {
  username: string;
  email: string;
}

const AsyncForm: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    username: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 假设这是一个异步API调用
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟网络延迟
      setSuccessMessage('Form submitted successfully!');
    } catch (error) {
      setError('Submission failed, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formValues.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />
      </div>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
      {isSubmitting && <p>Submitting...</p>}
    </form>
  );
};

export default AsyncForm;