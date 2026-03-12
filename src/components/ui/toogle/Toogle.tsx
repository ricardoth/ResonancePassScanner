import React from 'react';
import { Switch } from 'react-native';
import { Colors } from '../../../theme/theme';

interface ToogleProps {
    isOn: boolean;
    onToogle: (updater: (prev: boolean) => boolean) => void;
    id: string;
}

export const Toogle: React.FC<ToogleProps> = ({ isOn, onToogle }) => {
    const handleChange = () => {
        onToogle((prev: boolean) => !prev);
    };

    return (
        <Switch
            value={isOn}
            onValueChange={handleChange}
            trackColor={{
                false: Colors.bgElevated,
                true: `${Colors.brandPrimary}80`,
            }}
            thumbColor={isOn ? Colors.brandPrimary : Colors.textMuted}
            ios_backgroundColor={Colors.bgElevated}
        />
    );
};
