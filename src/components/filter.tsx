import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";


export default function FilterButton() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="py-4 px-7">
          Filter 
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="assinged">Assigned</DropdownItem>
        <DropdownItem key="assigned-to">Assigned to</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
