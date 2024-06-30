import { cn } from "@/utils/classnames";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { modal } from "@/components/ui/modals";
import { Button } from "@/components/ui/button";
import { Database, useDBStore } from "@/stores";
import { IconLoader } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "@/components/hooks/use-form-state";
import {
  FormField,
  FormLabel,
  FormError,
  FormFieldset,
} from "@/components/ui/form";

export const DatabaseCreator = () => {
  const form = useFormState<Pick<Database, "name" | "description">>({
    defaultValue: {
      name: "",
      description: "",
    },
    validations: {
      name: (value) => (!value.trim() ? "name cannot be null" : undefined),
    },
  });

  const create = () =>
    form.submit(async (data) => {
      modal.setState({ isConfirming: true });

      await useDBStore
        .getState()
        .create(data)
        .then(() => modal.close())
        .catch(() => {
          toast.error("failed to create database");

          form.setError("name", "check the database name again");
        });
    });

  return (
    <FormFieldset title="Database Metadata">
      <FormField>
        <FormLabel error={!!form.errors?.name} htmlFor="name">
          Name
        </FormLabel>
        <Input
          name="name"
          value={form.data?.name}
          disabled={form.isSubmitting}
          placeholder="database name, must be unique"
          onChange={(e) => form.setValue("name", e.target.value)}
          className={cn(
            !!form.errors?.name &&
              "border-destructive focus-visible:ring-destructive"
          )}
        />
        <FormError>{form.errors?.name}</FormError>
      </FormField>
      <FormField>
        <FormLabel error={!!form.errors?.description} htmlFor="description">
          Description
        </FormLabel>
        <Textarea
          name="description"
          disabled={form.isSubmitting}
          value={form.data?.description}
          placeholder="This database is a..."
          onChange={(e) => form.setValue("description", e.target.value)}
          className={cn(
            !!form.errors?.description &&
              "border-destructive focus-visible:ring-destructive"
          )}
        />
        <FormError>{form.errors?.description}</FormError>
      </FormField>
      <p className="text-muted-foreground text-xs">
        This app is client side apps (no server or login required), and all
        processing is done in the browser and persistent data saved in
        indexedDB, so your data stays private.
      </p>
      <Button disabled={form.isSubmitting} onClick={create} className="gap-x-1">
        {form.isSubmitting && <IconLoader className="size-4 animate-spin" />}
        <span>Create</span>
      </Button>
    </FormFieldset>
  );
};
