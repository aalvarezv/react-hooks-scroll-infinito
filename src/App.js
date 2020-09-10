import React, {useState, useRef, useEffect, useCallback } from 'react';
import useBookSearch from './useBookSearch';

const App = () => {

    /* Demuestra como obtener el estado actual y le suma 1
    const [count, setCount] = useState(0)
    useEffect(() => {
        setCount(prevCount => {
            return prevCount + prevCount
        })
    }, [query])
    */    

    const [query, setQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const {
        loading, 
        error, 
        books, 
        hasMore
    } = useBookSearch(query, pageNumber)


    const observer = useRef()
    //esta referencia llama a la función y le pasa el elemento creado.
    const lastBookElementRef = useCallback( node => {

        //console.log('NODE', node)
        if(loading) {
            //console.log('CARGANDO...')
            return
        }
        if(observer.current) {
            //console.log('OBSERVER.CURRENT.DISCONECT()...')
            //console.log(observer.current)
            observer.current.disconnect()
        }
        observer.current = new IntersectionObserver(entries => {
            //entries[0] es el elemento que estamos observando, en este caso el último registro.
            //console.log(entries);
            if(entries[0].isIntersecting){
                console.log('VISIBLE ULTIMO DIV')
            }
            if(entries[0].isIntersecting && hasMore){
                console.log('HAY MAS')
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        
        
        if(node){
            observer.current.observe(node);
            //console.log('OBSERVE', observer.current)
        }
        
    },[loading, hasMore]);
    
    function handleSearch(e){
        setQuery(e.target.value)
        setPageNumber(2)
    }

    return (   
        <>
            <input 
                type="text"
                value={query}
                onChange={handleSearch}
            ></input>
            {books.map((book, index) => {

                if(books.length === index + 1){
                    //ultimo libro, pasa la referencia para que se almacene con el useCallback
                    return  <div ref={lastBookElementRef} key={index}>{`${index} - ${book}`}</div>
                }else{
                    return  <div key={index}>{`${index} - ${book}`}</div>
                }
                
            } )}
            <div>{loading && 'Loading...'}</div>
            <div>{error && 'Error!'}</div>

        </>
    );
}
 
export default App;