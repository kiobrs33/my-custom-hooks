import { useState } from "react";

export const useCounter = (initialState = 1) => {
    const [state, setState] = useState(initialState);

    const increment = (factor = 1) => {
        setState(state + factor);
    }

    const decrement = (factor = 1) => {
        setState(state - factor);
    }

    const reset = () => {
        setState(initialState);
    }

    return {
        state,
        increment,
        decrement,
        reset,
    };
}
