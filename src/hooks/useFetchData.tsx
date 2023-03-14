import { useEffect, useState } from "react";

const useFetchData = <T,>(url: string, initialEntries: T) => {

    const [data, setData] = useState<T>(initialEntries);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);
    

    const getApiData= async () =>{
        setIsLoading(true);
        await fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw Error(
                        "It is not possible to fetch the data from the API"
                    );
                })
                .then(data =>{
                    setData(data);
                    setIsLoading(false);
                    setError(null);
                })
                .catch((er) => {
                    setIsLoading(false);
                    setError(er);
                });
    }
    

    useEffect(() => {
        setTimeout(()=>{
            getApiData();
        }, 2000)
           
    }, [url]);

    return {data, isLoading, error};
}
 
export default useFetchData;