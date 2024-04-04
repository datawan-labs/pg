import { useState } from "react";
import { useDBStore } from "@/stores";
import * as Tabs from "@radix-ui/react-tabs";
import { Badge } from "@/components/ui/badge";
import { modal } from "@/components/ui/modals";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layouts/container";
import { SchemaERD } from "@/components/interfaces/schema-erd";
import { useIsDesktop } from "./components/hooks/use-is-desktop";
import { Header, HeaderLogo } from "@/components/layouts/header";
import { ThemeSwitcher } from "./components/layouts/theme-switcher";
import { QueryHistory } from "@/components/interfaces/query-history";
import { QueryPlayground } from "@/components/interfaces/query-playground";
import { Navigation, NavigationItem } from "@/components/layouts/navigation";
import { DatabaseList } from "@/components/interfaces/database-setup/database-list";
import {
  IconLogs,
  IconDatabase,
  IconHierarchy2,
  IconTableColumn,
  IconBrandGithub,
} from "@tabler/icons-react";

const App = () => {
  const isDesktop = useIsDesktop();

  const activeDatabase = useDBStore((state) => state.active);

  const [activeMenu, setActiveMenu] = useState("playground");

  const openDatabaseMenu = () =>
    modal.open({
      title: "Databases",
      children: <DatabaseList />,
      description: "It start with postgresql and ended with postgresql",
    });

  return (
    <Container>
      <Header>
        <HeaderLogo />
        <div className="flex flex-row items-start gap-1 px-2">
          <h1 className="text-xl font-semibold capitalize">{activeMenu}</h1>
          {activeDatabase && (
            <Badge className="hidden flex-row items-center gap-0.5 sm:flex">
              <IconDatabase className="size-3 stroke-1" />
              <span className="line-clamp-1">{activeDatabase.name}</span>
            </Badge>
          )}
        </div>
        <div className="ml-auto mr-2 flex flex-row items-center justify-center gap-1.5 ">
          <Button asChild size="icon" variant="ghost" className="size-7">
            <a
              target="_blank"
              referrerPolicy="no-referrer"
              href="https://github.com/datawan-labs/pg"
            >
              <IconBrandGithub className="size-4" />
            </a>
          </Button>
          <ThemeSwitcher />
          <Button
            size="sm"
            variant="outline"
            onClick={openDatabaseMenu}
            className="gap-1.5 text-sm"
          >
            <IconDatabase className="size-4" />
            <span className="hidden md:block">Database</span>
          </Button>
        </div>
      </Header>
      <Tabs.Root
        value={activeMenu}
        defaultValue="playground"
        onValueChange={setActiveMenu}
        orientation={isDesktop ? "vertical" : "horizontal"}
        className="flex h-full flex-1 flex-col-reverse overflow-hidden md:flex-row"
      >
        <Tabs.List asChild>
          <Navigation>
            <Tabs.Trigger value="playground" asChild>
              <NavigationItem
                tooltip="Playground"
                active={activeMenu === "playground"}
              >
                <IconTableColumn className="size-5" />
              </NavigationItem>
            </Tabs.Trigger>
            <Tabs.Trigger value="history" asChild>
              <NavigationItem
                tooltip="Query History"
                active={activeMenu === "history"}
              >
                <IconLogs className="size-5" />
              </NavigationItem>
            </Tabs.Trigger>
            <Tabs.Trigger value="erd" asChild>
              <NavigationItem active={activeMenu === "erd"} tooltip="ERD">
                <IconHierarchy2 className="size-5" />
              </NavigationItem>
            </Tabs.Trigger>
          </Navigation>
        </Tabs.List>
        {activeDatabase && (
          <main className="flex flex-1 flex-col overflow-hidden">
            <Tabs.Content value="playground" asChild>
              <QueryPlayground />
            </Tabs.Content>
            <Tabs.Content value="history" asChild>
              <QueryHistory />
            </Tabs.Content>
            <Tabs.Content value="erd" asChild>
              <SchemaERD />
            </Tabs.Content>
          </main>
        )}
        {!activeDatabase && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-2 text-center">
            <h2 className="text-lg font-bold">No database</h2>
            <p className="text-xs text-muted-foreground">
              You can start playing as soon as you connect a database.
            </p>
            <Button
              size="sm"
              onClick={openDatabaseMenu}
              className="gap-1.5 text-sm"
            >
              <IconDatabase className="size-4" />
              <span>Database</span>
            </Button>
          </div>
        )}
      </Tabs.Root>
    </Container>
  );
};

export default App;
