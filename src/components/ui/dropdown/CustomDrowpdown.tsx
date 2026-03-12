import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Colors, Radius } from '../../../theme/theme';

interface CustomDropdownProps {
    items: Array<{ label: string; value: string }>;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
}

export const CustomDrowpdown: React.FC<CustomDropdownProps> = ({
    items,
    defaultValue = null,
    onValueChange,
    placeholder = 'Seleccione',
}) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(defaultValue);
    const [itemState, setItemState] = useState(items);

    useEffect(() => {
        setItemState(items);
    }, [items]);

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
            textStyle={styles.text}
            dropDownContainerStyle={styles.dropdownContainer}
            placeholderStyle={styles.placeholder}
            selectedItemLabelStyle={styles.selectedLabel}
            listItemLabelStyle={styles.listItemLabel}
            arrowIconStyle={styles.arrow}
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        backgroundColor: Colors.bgElevated,
        borderColor: Colors.bgBorderStrong,
        borderRadius: Radius.md,
        minHeight: 48,
    },
    text: {
        color: Colors.textPrimary,
        fontSize: 15,
    },
    dropdownContainer: {
        backgroundColor: Colors.bgElevated,
        borderColor: Colors.bgBorderStrong,
        borderRadius: Radius.md,
        marginTop: 4,
    },
    placeholder: {
        color: Colors.textMuted,
        fontSize: 15,
    },
    selectedLabel: {
        color: Colors.brandPrimary,
        fontWeight: '600',
    },
    listItemLabel: {
        color: Colors.textPrimary,
        fontSize: 14,
    },
    arrow: {
        tintColor: Colors.textSecondary,
    },
});
