import { Button } from "@/components/ui/button";
import { Modals, modal } from "@/components/ui/modals";
import { Toaster, toast } from "@/components/ui/sonner";

const App = () => {
  return (
    <div vaul-drawer-wrapper="" className="relative min-h-screen bg-white">
      <div>whatever it is</div>
      <Button
        onClick={() =>
          modal.openConfirmModal({
            title: "modal title",
            children: <>this is modal</>,
          })
        }
      >
        open modal
      </Button>
      <Button
        onClick={() =>
          toast("open", {
            action: {
              label: "open modal",
              onClick: () =>
                modal.open({
                  title: "modal title",
                  children: <>this is modal</>,
                }),
            },
          })
        }
      >
        open smodal
      </Button>
      <Modals />
      <Toaster />
    </div>
  );
};

export default App;
