import React from "react";

const allData = new Array(40).fill(0).map((_val, i) => i + 1);
const perPage = 10;

//types para el REDUCER
const types = {
    start: "START",
    loaded: "LOADED"
};

//Reducer
const reducer = (state, action) => {
    switch (action.type) {
        case types.start:
            return { ...state, loading: true };
        case types.loaded:
            return {
                ...state,
                loading: false,
                data: [...state.data, ...action.newData],
                more: action.newData.length === perPage,
                after: state.after + action.newData.length
            };
        default:
            throw new Error("Don't understand action");
    }
};

//Contexto
const MyContext = React.createContext();

//Provider
function MyProvider({ children }) {

    //Inicializando datos
    const [state, dispatch] = React.useReducer(reducer, {
        loading: false,
        more: true,
        data: [],
        after: 0
    });
    const { loading, data, after, more } = state;

    //Simulando carga de datos de una API REST, un retraso de 0.3 segundos
    //Se dispara la accion para la LOADED
    const load = () => {
        dispatch({ type: types.start });

        setTimeout(() => {
            const newData = allData.slice(after, after + perPage);

            //Se dispara la accion de llegada de datos desde la API REST
            dispatch({ type: types.loaded, newData });
        }, 1000);
    };

    return (
        <MyContext.Provider value={{ loading, data, more, load }}>
            {children}
        </MyContext.Provider>
    );
}



function App() {
    //Usando datos del STORE REDUCER
    const { data, loading, more, load } = React.useContext(MyContext);

    //Creando una referencia de LOAD, para sollo instaciarlo una vez
    const loader = React.useRef(load);

    //Creando el OBSERVADOR e instaciado solo una vez
    const observer = React.useRef(
        new IntersectionObserver(
            //Recibe una lista de objetos
            entries => {
                //Se obtiene el primer ITEM
                const first = entries[0];

                //Se obtiene el VALOR DE LOAD true o false
                if (first.isIntersecting) {

                    loader.current();
                }
            },
            //Solo se ejecutara el Callback cuando el item este al 100% dentro del ROOT
            { threshold: 1 }
        )
    );


    const [element, setElement] = React.useState(null);

    //Pendiente a los cambios de LOAD
    //Si hay un cambio se el VALOR REF de LOADER
    React.useEffect(() => {
        loader.current = load;
    }, [load]);


    //Pendiente al cambio de ELEMENT
    React.useEffect(() => {
        const currentElement = element;
        const currentObserver = observer.current;

        if (currentElement) {
            currentObserver.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                currentObserver.unobserve(currentElement);
            }
        };
    }, [element]);

    return (
        <div className="App">
            <ul>
                {data.map(row => (
                    <li key={row} style={{ background: "orange" }}>
                        {row}
                    </li>
                ))}

                {loading && <li>Loading...</li>}

                {!loading && more && (
                    <li ref={setElement} style={{ background: "transparent" }}></li>
                )}
            </ul>
        </div>
    );
}

export default () => {
    return (
        <MyProvider>
            <App />
        </MyProvider>
    );
};