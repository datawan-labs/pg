import { FC } from "react";
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

export const DatabaseEditor: FC<{
  database: Pick<Database, "name" | "description">;
}> = ({ database }) => {
  const form = useFormState<Pick<Database, "description">>(database);

  const create = () =>
    form.submit(async (data) => {
      await useDBStore
        .getState()
        .update(database.name, data)
        .then(() => modal.close())
        .catch(() => toast.error("failed to update database metadata"));
    });

  return (
    <FormFieldset title="Database Metadata">
      <FormField>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input disabled name="name" value={database.name} />
      </FormField>
      <FormField>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          name="description"
          disabled={form.isSubmitting}
          value={form.data?.description}
          placeholder="This database is a..."
          onChange={(e) => form.setValue("description", e.target.value)}
        />
        <FormError>{form.errors?.description}</FormError>
      </FormField>
      <Button disabled={form.isSubmitting} onClick={create} className="gap-x-1">
        {form.isSubmitting && <IconLoader className="size-4 animate-spin" />}
        <span>Update</span>
      </Button>
    </FormFieldset>
  );
};
