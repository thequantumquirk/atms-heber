import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { TaskType } from "@/types/tasktype";

type Props = { milestones: TaskType };

const Update = (milestones: Props) => {
console.log(milestones.milestones.milestones)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const keys = Object.keys(milestones.milestones.milestones);
  const values = Object.values(milestones.milestones.milestones);
  console.log(keys);
  return (
    <div>
      <Button
        onPress={() => onOpen()}
        className="bg-slate-100 rounded-lg py-2 text-sm w-full"
      >
        Update Task
      </Button>
      <Modal size="md" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Milestones
              </ModalHeader>
              <ModalBody>
                <div>
                  <h1 className="text-lg font-bold">
                    Update What Youve Completed!
                  </h1>
                  <div className="mx-10 my-5">
                    {keys.map((Key, key) => {
                      return (
                        <div key={key}>
                          <Checkbox
                            value={Key}
                            defaultSelected={values[key]}
                          >
                            {Key}
                          </Checkbox>
                          <br></br>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={() => onClose()}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Update;
