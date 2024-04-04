import { create } from "zustand";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconLoader } from "@tabler/icons-react";
import { useIsDesktop } from "@/components/hooks/use-is-desktop";
import {
  Dialog,
  DialogSize,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerTitle,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawer";

const FADE_DURATION = 200;

interface ModalArgs {
  type: "MODAL";

  title?: string;

  description?: string;

  children?: ReactNode;

  size?: DialogSize;
}

interface ModalConfirmArgs {
  type: "CONFIRM_MODAL";

  title?: string;

  description?: string;

  children?: ReactNode;

  size?: DialogSize;

  label?: {
    confirm?: string;

    cancel?: string;
  };

  onConfirm?: () => void | Promise<void>;

  /**
   * close when confirm button clicked.
   * default true
   */
  closeOnConfirm?: boolean;

  onCancel?: () => void;

  /**
   * close when cancel button clicked.
   * default true
   */
  closeOnCancel?: boolean;
}

interface ModalState {
  isOpen: boolean;
  isSubmitting: boolean;
  modals: (ModalArgs | ModalConfirmArgs)[];
}

export const useModalStore = create<ModalState>()(() => ({
  modals: [],
  isOpen: false,
  isSubmitting: false,
}));

/**
 * modals function to trigger all action
 * in modals, e.g open, close, and closeAll
 */
export const modal = {
  /**
   * open new standard modals
   *
   * @param args
   * @returns
   */
  open: (args: Omit<ModalArgs, "type">) =>
    useModalStore.setState((state) => ({
      isOpen: true,
      modals: [...state.modals, { ...args, type: "MODAL" }],
    })),

  /**
   * open confirm modals, confirm modals
   * has confirm and cancel button
   *
   * @param args
   * @returns
   */
  openConfirmModal: (args: Omit<ModalConfirmArgs, "type">) =>
    useModalStore.setState((state) => ({
      isOpen: true,
      modals: [...state.modals, { ...args, type: "CONFIRM_MODAL" }],
    })),

  /**
   * close last modals and open previous modals
   * if exist
   *
   * @returns
   */
  close: () => {
    const modals = useModalStore.getState().modals;

    if (modals.length > 1)
      return useModalStore.setState((state) => ({
        modals: state.modals.slice(0, -1),
      }));

    useModalStore.setState({ isOpen: false, isSubmitting: false });

    /**
     * note that we reset the state in setTimeout
     * after FADE_DURATION, this because we need
     * to keep the modals content until modals
     * fully closed
     */
    setTimeout(() => useModalStore.setState({ modals: [] }), FADE_DURATION);
  },

  closeAll: () => {
    useModalStore.setState({ isOpen: false, isSubmitting: false });

    /**
     * note that we reset the state in setTimeout
     * after FADE_DURATION, this because we need
     * to keep the modals content until modals
     * fully closed
     */
    setTimeout(() => useModalStore.setState({ modals: [] }), FADE_DURATION);
  },

  /**
   * updat internal state from outsize word
   */
  setState: (state: Pick<ModalState, "isSubmitting">) =>
    useModalStore.setState(state),
};

/**
 * modals components
 */
export const Modals = () => {
  const isDesktop = useIsDesktop();

  const isOpen = useModalStore((state) => state.isOpen);

  const isSubmitting = useModalStore((state) => state.isSubmitting);

  const modals = useModalStore((state) => state.modals);

  const activeModal = modals[modals.length - 1];

  const closeModal = () => modal.close();

  const onConfirm = async () => {
    if (!activeModal) return;

    if (activeModal.type === "MODAL") return;

    if (activeModal.onConfirm) {
      try {
        useModalStore.setState({ isSubmitting: true });

        await activeModal.onConfirm();
      } catch (error) {
        throw error as Error;
      } finally {
        useModalStore.setState({ isSubmitting: false });
      }
    }

    if (activeModal.closeOnConfirm !== false) return modal.close();
  };

  const onCancel = () => {
    if (!activeModal) return;

    if (activeModal.type === "MODAL") return;

    activeModal.onCancel?.();

    /**
     * by default
     */
    if (activeModal.closeOnCancel !== false) return modal.close();
  };

  return isDesktop ? (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className="bg-background text-foreground"
        size={activeModal?.size}
        onPointerDownOutside={(e) => {
          if (activeModal?.type === "CONFIRM_MODAL" || isSubmitting)
            e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (activeModal?.type === "CONFIRM_MODAL" || isSubmitting)
            e.preventDefault();
        }}
      >
        {(activeModal?.title || activeModal?.description) && (
          <DialogHeader>
            {activeModal.title && (
              <DialogTitle>{activeModal.title}</DialogTitle>
            )}
            {activeModal.description && (
              <DialogDescription>{activeModal.description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="overflow-auto">{activeModal?.children}</div>
        {activeModal?.type === "CONFIRM_MODAL" && (
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="mt-2 sm:mt-0"
            >
              {activeModal?.label?.cancel || "Cancel"}
            </Button>
            <Button
              className="gap-2"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting && <IconLoader className="size-4 animate-spin" />}
              <span>{activeModal?.label?.confirm || "Confirm"}</span>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer
      open={isOpen}
      shouldScaleBackground
      dismissible={activeModal?.type !== "CONFIRM_MODAL"}
      onOpenChange={(open) =>
        !open && activeModal?.type !== "CONFIRM_MODAL" && closeModal()
      }
    >
      <DrawerContent>
        {(activeModal?.title || activeModal?.description) && (
          <DrawerHeader>
            {activeModal.title && (
              <DrawerTitle>{activeModal?.title}</DrawerTitle>
            )}
            {activeModal.description && (
              <DrawerDescription>{activeModal?.description}</DrawerDescription>
            )}
          </DrawerHeader>
        )}
        <div className="overflow-auto">{activeModal?.children}</div>
        {activeModal?.type === "CONFIRM_MODAL" && (
          <DrawerFooter className="pt-2">
            <Button
              className="gap-2"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting && <IconLoader className="size-4 animate-spin" />}
              <span>{activeModal?.label?.confirm || "Confirm"}</span>
            </Button>
            <DrawerClose asChild disabled={isSubmitting}>
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="mt-2 sm:mt-0"
              >
                {activeModal?.label?.cancel || "Cancel"}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
