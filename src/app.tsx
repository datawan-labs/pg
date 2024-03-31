import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { modal } from "@/components/ui/modals";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layouts/container";
import { QueryLogs } from "@/components/interfaces/query-logs";
import { SchemaERD } from "@/components/interfaces/schema-erd";
import { useDarkMode } from "./components/hooks/use-dark-mode";
import { useIsDesktop } from "./components/hooks/use-is-desktop";
import { QueryPlayground } from "@/components/interfaces/query-playground";
import { Navigation, NavigationItem } from "@/components/layouts/navigation";
import { Header, HeaderLogo, HeaderTitle } from "@/components/layouts/header";
import { DatabaseList } from "@/components/interfaces/database-setup/database-list";
import {
  IconLogs,
  IconDatabase,
  IconHierarchy2,
  IconTableColumn,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";

const App = () => {
  const isDesktop = useIsDesktop();

  const [active, setActive] = useState("playground");

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Container>
      <Header>
        <HeaderLogo />
        <HeaderTitle className="capitalize">{active}</HeaderTitle>
        <div className="ml-auto mr-2 flex flex-row items-center justify-center gap-1.5 ">
          <Button
            size="icon"
            className="size-8"
            variant="ghost"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <IconSun className="size-4" />
            ) : (
              <IconMoon className="size-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-sm"
            onClick={() =>
              modal.open({
                title: "Databases",
                children: <DatabaseList />,
                description: "Everything is postgres in the end of the day",
              })
            }
          >
            <IconDatabase className="size-4" />
            <span className="hidden md:block">Database</span>
          </Button>
        </div>
      </Header>
      <Tabs.Root
        value={active}
        defaultValue="playground"
        onValueChange={setActive}
        orientation={isDesktop ? "vertical" : "horizontal"}
        className="flex h-full flex-1 flex-col-reverse overflow-hidden md:flex-row"
      >
        <Tabs.List asChild>
          <Navigation>
            <Tabs.Trigger value="playground" asChild>
              <NavigationItem
                tooltip="Playground"
                active={active === "playground"}
              >
                <IconTableColumn className="size-5" />
              </NavigationItem>
            </Tabs.Trigger>
            <Tabs.Trigger value="logs" asChild>
              <NavigationItem tooltip="Query Logs" active={active === "logs"}>
                <IconLogs className="size-5" />
              </NavigationItem>
            </Tabs.Trigger>
            <Tabs.Trigger value="erd" asChild>
              <NavigationItem active={active === "erd"} tooltip="ERD">
                <IconHierarchy2 className="size-5" />
              </NavigationItem>
            </Tabs.Trigger>
          </Navigation>
        </Tabs.List>
        <main className="flex flex-1 flex-col overflow-auto">
          <Tabs.Content value="playground" asChild>
            <QueryPlayground />
          </Tabs.Content>
          <Tabs.Content value="logs" asChild>
            <QueryLogs />
          </Tabs.Content>
          <Tabs.Content value="erd" asChild>
            <SchemaERD />
          </Tabs.Content>
        </main>
      </Tabs.Root>
    </Container>
  );
};

export default App;
