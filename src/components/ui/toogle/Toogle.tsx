import { Switch } from "react-native";

interface ToogleProps {
    isOn: any;
    onToogle: any;
    id: any;
}

export const Toogle: React.FC<ToogleProps> = ({isOn, onToogle, id}) => {
    const handleChange = () => {
        onToogle((prev: any) => !prev);
    }

    return (
        <>
            <Switch 
                id={id}
                value={isOn}
                onValueChange={handleChange}

            />
        </>
    )
}
