import { useState } from 'react';

export const useForm = (initialState = {}) => {
    const [valueState, setValueState] = useState(initialState)

    const handleInputChange = ({target}) => {
        setValueState({
            ...valueState,
            [target.name] : target.value,
        });
    }

    const handleReset = () => {
        setValueState(initialState);
    }

    return [valueState, handleInputChange, handleReset]
}
