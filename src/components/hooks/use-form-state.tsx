import { useState } from "react";

interface FormState<T = unknown> {
  data: T;
  isSubmitting: boolean;
  errors?: Record<keyof T, string>;
}

interface FormParams<T extends object> {
  defaultValue: T;
  validations?: Partial<{
    [K in keyof T]: (value: T[K], data: T) => string | undefined;
  }>;
}

export const useFormState = <T extends object>(params: FormParams<T>) => {
  const [form, setForm] = useState<FormState<T>>({
    isSubmitting: false,
    data: params.defaultValue,
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
   * set data value
   */
  const setValue = <X extends keyof T>(key: X, value: T[X]) =>
    setForm((state) => ({
      ...state,
      data: { ...state.data, [key]: value } as FormState<T>["data"],
      errors: {
        ...state.errors,
        [key]: params.validations?.[key]?.(value, form.data),
      } as FormState<T>["errors"],
    }));

  /**
   * submit data with async
   */
  const submit = async (cb: (data: T) => Promise<unknown>): Promise<void> => {
    let errors: FormState<T>["errors"];

    /**
     * validate all fields
     */
    if (params.validations) {
      errors = (Object.keys(params.validations) as (keyof T)[]).reduce(
        (prev, key) => ({
          ...prev,
          [key]: params.validations?.[key]?.(form.data?.[key], form.data),
        }),
        {} as Partial<FormState<T>["errors"]>
      ) as FormState<T>["errors"];
    }

    /**
     * return if some fields has error
     */
    if (errors)
      for (const key in errors)
        if (errors[key])
          return setForm((state) => ({ ...state, errors: errors }));

    try {
      setForm((state) => ({
        ...state,
        errors: undefined,
        isSubmitting: true,
      }));

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
    setError: setError,
    setValue: setValue,
  };
};
