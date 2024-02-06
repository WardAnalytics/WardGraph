import { FC, useContext } from "react";
import { GraphContext } from "../../Graph";

import Modal from "../../../common/Modal";
import SearchBar from "../../search_bar";

interface NewAddressModalProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const NewAddressModal: FC<NewAddressModalProps> = ({ isOpen, setOpen }) => {
  const { addNewAddressToCenter } = useContext(GraphContext);

  function handleSearchAddress(address: string) {
    addNewAddressToCenter(address);
    setOpen(false);
  }

  return (
    <Modal isOpen={isOpen} closeModal={() => setOpen(false)}>
      <div className="h-fit w-[40rem] bg-white">
        <SearchBar onSearchAddress={handleSearchAddress} />
      </div>
    </Modal>
  );
};

export default NewAddressModal;
