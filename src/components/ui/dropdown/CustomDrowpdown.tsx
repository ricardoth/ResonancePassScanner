import React, {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

interface CustomDropdownProps {
    items: Array<{label: string; value: string}>;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
}

export const CustomDrowpdown : React.FC<CustomDropdownProps> = ({
    items,
    defaultValue = null,
    onValueChange,
    placeholder = "Seleccione"
}) => {

    const [ open, setOpen ] = useState(false);
    const [ value, setValue ] = useState<string | null>(defaultValue);
    const [ itemState, setItemState ] = useState(items);

    useEffect(() => {
        setItemState(items); 
    }, [items])
    
    return (
        <DropDownPicker
            open={open}
            value={value}
            items={itemState}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItemState}
            onChangeValue={onValueChange}
            placeholder={placeholder}
            listMode="SCROLLVIEW"
            style={styles.dropdown}
            theme='DARK'
        />
    )
}

const styles = StyleSheet.create({
    dropdown: {
        width: 300,
    }
});