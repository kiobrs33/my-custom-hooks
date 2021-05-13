import { useEffect, useRef, useState } from "react"

export const useFetch = (url) => {

    //USE REF
    const estaMontado = useRef(true);

    const [state, setState] = useState({
        data : null,
        loading : true,
        error : null,
    });

    useEffect(() => {
        return()=>{
            estaMontado.current = false;
        }
    }, [])

    useEffect(() => {
        //Limpiando State por cada Consulta Diferente
        setState({ loading : true, error : null, data : null });

        fetch(url)
            .then( resp => resp.json() )
            .then( data => {  
                setTimeout(()=>{
                    if (estaMontado.current) {
                        setState({
                            loading : false,
                            error : null,
                            data
                        });
                    } else {
                        console.log('SetState No se llamo, Esta desmontado')  
                    }
                    
                },2000);
            });
    }, [url]);


    return state;
}