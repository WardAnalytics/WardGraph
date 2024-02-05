import { FC, useContext } from "react";
import Modal from "../../common/Modal";
import { GraphContext } from "../Graph";
import { storeAddress } from "../../../services/firebase/search-history/search-history";

import Searchbar from "../LandingPage/SearchBar";
import authService from "../../../services/auth/auth.services";

interface NewAddressModalProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const NewAddressModal: FC<NewAddressModalProps> = ({ isOpen, setOpen }) => {
  const { addNewAddressToCenter } = useContext(GraphContext);

  const { user } = authService.useAuthState();

  const handleSearchAddress = async (address: string) => {
    await storeAddress(address, user?.uid);
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
