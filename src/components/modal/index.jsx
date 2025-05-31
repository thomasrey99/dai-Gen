import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

export default function ModalConfirm({ isOpen, onOpen, onOpenChange, title, text, action, actionTitle }) {
  /*const {isOpen, onOpen, onOpenChange} = useDisclosure();*/

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <div>
                  <p>{text}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="warning" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={()=>action("Modal")}>
                  {actionTitle}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
