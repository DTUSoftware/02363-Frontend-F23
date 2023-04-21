import { useCallback, useEffect, useState } from "react";


const useFetch =<T,>(url: string, options?: RequestInit)=>{
    const [data, setData] = useState<T>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [status, setStatus] = useState(0);
    

    function sendRequest(){
        setIsLoading(true);
        setError("");
        fetch(url,options)
                .then((response) => {
                    console.log("response"+ response.status)
                    setStatus(response.status)
                    if (response.ok) {
                        return response.json();                    
                    }
                    setIsLoading(false);
                    setError(response.statusText)
                    throw response.status
                })
                .then(d =>{                    
                    setData(d);
                    setIsLoading(false);
                    setError("");
                })
                .catch((er) => {
                    setIsLoading(false);
                    setError(er.message);
                });
    }

    return {sendRequest, status, data, isLoading, error};
}

export default useFetch;


