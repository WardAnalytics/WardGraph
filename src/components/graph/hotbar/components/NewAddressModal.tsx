import { FC, useContext } from "react";
import { GraphContext } from "../../Graph";

import Modal from "../../../common/Modal";
import SearchBar from "../../search_bar";

import { storeSearchedAddress } from "../../../../services/firestore/user/search_history";
import useAuthState from "../../../../hooks/useAuthState";

interface NewAddressModalProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const NewAddressModal: FC<NewAddressModalProps> = ({ isOpen, setOpen }) => {
  const { addNewAddressToCenter } = useContext(GraphContext);
  const { user } = useAuthState();

  const handleSearchAddress = async (address: string) => {
    if (user) storeSearchedAddress(user.uid, address); // Fire and forget, we don't care about the result. TODO - Handle user searching without being logged in
    addNewAddressToCenter(address);
    setOpen(false);
  };

  return (
    <Modal isOpen={isOpen} closeModal={() => setOpen(false)}>
      <div className="h-fit w-[40rem] bg-white">
        <SearchBar onSearchAddress={handleSearchAddress} />
      </div>
    </Modal>
  );
};

export default NewAddressModal;
