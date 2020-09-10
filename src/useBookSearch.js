import {useEffect, useState} from 'react'
import axios from 'axios'

function useBookSearch(query, pageNumber) {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setBooks([])
    },[query])

    useEffect(() => {

            setLoading(true)
            setError(false)

            let cancel
            
            axios({
                method: 'GET',
                url: 'http://openlibrary.org/search.json',
                params: {q: query, page: pageNumber},
                cancelToken: new axios.CancelToken(c => cancel = c)
            }).then(resp => {
                console.log(resp.data)
                //ejecuta una funcion que recibe 
                setBooks(prevBooks => {
                    //prevBooks es el state actual
                    //retorna un array con los valores previos + los de la llamada y con el Set quita los duplicados.
                    //console.log('SIN SPREAD',resp.data.docs)
                    //console.log('SPREAD',...resp.data.docs)
                    //console.log(resp.data.docs.length)
                     //[...new Set(
                     return [
                        ...prevBooks, 
                        ...resp.data.docs.map(b => b.title)
                    ]//)]
                })
                //si hay mas que 0 true
                setHasMore(resp.data.docs.length > 0)
                setLoading(false)
            }).catch(e => {
                if(axios.isCancel(e)) {
                    //console.log('axios fue cancelado')
                    return
                }
                //si el error no es de cancelación de la promesa entonces lo muestra en la consola y setea el state true.
                console.log(e)
                setError(true)
            })
            //truco, ejecuta una función que ->
            return () => {
                //-> cancela la promesa en ejecución, en este caso la llamada de axios.
                //console.log('cancela la promesa...')
                cancel()
            }

    }, [query, pageNumber])

    return {loading, error, books, hasMore}
}

export default useBookSearch
