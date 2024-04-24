import { ComponentProps, FC } from "react";
import { modal } from "@/components/ui/modals";
import { Button } from "@/components/ui/button";
import { Database, useDBStore } from "@/stores";
import { DatabaseEditor } from "./database-editor";
import { DatabaseCreator } from "./database-creator";
import { IconCircleCheckFilled, IconDotsVertical } from "@tabler/icons-react";
import {
  Command,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandInput,
  CommandGroup,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  SAMPLE_DATA,
  SampleDataMeta,
  SampleDatakey,
} from "@/postgres/sample-data";

const DatabaseListItem: FC<{
  database: Pick<Database, "name" | "description" | "createdAt">;
}> = ({ database }) => {
  const active = useDBStore((state) => state.active);

  const connectToDatabase: ComponentProps<"button">["onClick"] = (e) => {
    e.stopPropagation();

    useDBStore.getState().connect(database.name);
  };

  const editDatabaseMetadata = () =>
    modal.open({
      title: "Edit Database Metadata",
      children: <DatabaseEditor database={database} />,
    });

  const deleteDatabase = () =>
    modal.openConfirmModal({
      title: "Delete Database",
      children: `Delete ${database.name}?, this action cannot be undone`,
      onConfirm: () => useDBStore.getState().remove(database.name),
    });

  return (
    <div className="flex w-full flex-col gap-y-1 py-1">
      <div className="flex flex-row items-center justify-between">
        <div className="line-clamp-1 flex-1 font-semibold text-sm">
          <h4>{database.name}</h4>
        </div>
        <div className="flex flex-row items-center justify-center gap-x-1">
          {active?.name === database.name && (
            <div className="flex flex-row items-center justify-center gap-1">
              <IconCircleCheckFilled className="size-4" />
              <span className="text-xs italic">Connected</span>
            </div>
          )}
          {active?.name !== database.name && (
            <Button
              size="xs"
              variant="outline"
              className="text-xs"
              onClick={connectToDatabase}
            >
              <span>connect</span>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="size-7 text-xs">
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={editDatabaseMetadata}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteDatabase}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="hidden justify-between gap-4 sm:flex">
        <div className="whitespace-pre-wrap text-muted-foreground text-xs sm:line-clamp-1">
          {database.description}
        </div>
        <div className="whitespace-nowrap text-muted-foreground text-xs">
          {database.createdAt}
        </div>
      </div>
    </div>
  );
};

export const DatabaseList = () => {
  const dbs = useDBStore((state) => state.databases);

  const openCreatorModal = () =>
    modal.open({
      title: "Create Database",
      children: <DatabaseCreator />,
    });

  const importDatabase = (data: SampleDataMeta<SampleDatakey>) =>
    modal.openConfirmModal({
      closeOnConfirm: false,
      title: "Import Sample Data",
      children: `Continue to import ${data.name}?`,
      onConfirm: () =>
        useDBStore
          .getState()
          .import(data)
          .then(() => modal.closeAll()),
    });

  return (
    <div className="flex flex-col gap-y-4">
      <Command className="rounded-md border bg-background">
        <CommandInput placeholder="Connect to your database..." />
        <CommandList className="min-h-48">
          <CommandEmpty className="py-0">
            <div className="flex h-48 flex-1 flex-col items-center justify-center text-center">
              <h3 className="font-bold text-sm tracking-tight">No database</h3>
              <p className="text-muted-foreground text-xs">
                You can start playing as soon as you add a database.
              </p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="Saved Database">
            {Object.keys(dbs).map((name) => (
              <CommandItem
                key={name}
                value={name}
                onSelect={(value) => useDBStore.getState().connect(value)}
              >
                <DatabaseListItem database={dbs[name]} />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Sample data">
            {SAMPLE_DATA.map((data) => (
              <CommandItem
                key={data.key}
                value={data.key}
                onSelect={() => importDatabase(data)}
              >
                <div className="w-full space-y-1 py-1">
                  <h4 className="line-clamp-1 flex-1 font-semibold text-sm">
                    {data.name}
                  </h4>
                  <div className="whitespace-pre-wrap text-muted-foreground text-xs sm:line-clamp-1">
                    {data.description}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-[0.6rem] uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or Start With
          </span>
        </div>
      </div>
      <Button size="sm" onClick={openCreatorModal}>
        Create New Database
      </Button>
    </div>
  );
};
