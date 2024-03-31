import { useState } from "react";

interface FormState<T = unknown> {
  data: T;
  isSubmitting: boolean;
  errors?: Record<keyof T, string>;
}

export const useFormState = <T extends object>(defaultValue: T) => {
  const [form, setForm] = useState<FormState<T>>({
    isSubmitting: false,
    data: defaultValue,
  });

  /**
   * set error for specific key in data
   */
  const setError = (key: keyof T, message: string) =>
    setForm((state) => ({
      ...state,
      errors: { ...state.errors, [key]: message } as FormState<T>["errors"],
    }));

  /**
   * reset error for a key
   */
  const resetError = (key: keyof T) =>
    setForm((state) => ({
      ...state,
      errors: { ...state.errors, [key]: undefined } as FormState<T>["errors"],
    }));

  /**
   * set data value
   */
  const setValue = <X extends keyof T>(key: X, value: T[X]) =>
    setForm((state) => ({
      ...state,
      data: { ...state.data, [key]: value } as FormState<T>["data"],
    }));

  /**
   * submit data with async
   */
  const submit = async (cb: (data: T) => Promise<void>): Promise<void> => {
    try {
      /**
       * reset error and set submitting to true,
       * may be we can improve this by checking validation
       * before this line
       */
      setForm((state) => ({ ...state, errors: undefined, isSubmitting: true }));

      /**
       * run callback function
       */
      await cb(form.data);
    } catch (error) {
      throw error as unknown as Error;
    } finally {
      /**
       * set back isSubmitting to false, either error or not
       */
      setForm((state) => ({ ...state, isSubmitting: false }));
    }
  };

  return {
    data: form.data,
    errors: form.errors,
    isSubmitting: form.isSubmitting,
    submit: submit,
    setValue: setValue,
    setError: setError,
    resetError: resetError,
  };
};
