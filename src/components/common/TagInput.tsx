// This component uses react-select to create a label input field
// More info: https://react-select.com/creatable

import { FC, useEffect, useMemo, useState } from 'react';

import CreatableSelect from 'react-select/creatable';

import userCustomAddressesService from "../../services/firebase/graph/addresses/custom-tags";

interface TagInputProps {
    address: string;
}

const TagInput: FC<TagInputProps> = ({ address }) => {
    const [userCustomAddressLabels, setUserCustomAddressLabels] = useState<string[]>([]);

    const updateCustomAddressLabels = async (newLabels: string[]) => {
        await userCustomAddressesService.storeCustomAddressesTags(address, newLabels);
        setUserCustomAddressLabels(newLabels);
    };

    // TODO: Fetch the labels from the user and not from the address
    // Fetch existing labels from the database
    useEffect(() => {
        const fetchUserCustomAddressLabels = async () => {
            const labels = await userCustomAddressesService.getCustomAddressesTags(address);
            setUserCustomAddressLabels(labels);
        };

        fetchUserCustomAddressLabels();
    }, [address]);

    const existingLabels = useMemo(() => {
        const existingLabels = userCustomAddressLabels.map((option) => {
            return { value: option, label: option }

        });

        return existingLabels;
    }, [userCustomAddressLabels]);

    return (
        <CreatableSelect
            isMulti
            defaultValue={existingLabels}
            styles={{
                control: (styles) => ({ ...styles, backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', padding: '0.25rem 0.5rem' }),
            }}
            options={existingLabels}
            isSearchable
            backspaceRemovesValue={false}
            placeholder="Add a label"
            onChange={(e) => {
                const newLabels = e ? e.map((option) => option.value) : [];
                updateCustomAddressLabels(newLabels);
            }}
        />
    );
}

export default TagInput;