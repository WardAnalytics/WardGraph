import { FC, useContext } from "react";
import Modal from "../../common/Modal";
import { GraphContext } from "../Graph";

import Searchbar from "../LandingPage/SearchBar";

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
        <Searchbar onSearchAddress={handleSearchAddress} />
      </div>
    </Modal>
  );
};

export default NewAddressModal;
