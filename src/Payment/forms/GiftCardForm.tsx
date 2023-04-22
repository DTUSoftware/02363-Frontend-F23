import { useEffect, useRef, useState } from "react";
import giftCardIcon from "../../assets/giftcardicon.png";
import navigate from "../../Navigation/navigate";
import { routes } from "../../Navigation/RoutePaths";
import "./style.css" ;
import Beatloader from "../../SpinnerAnimation/BeatLoader";
import usePosthData from "../../hooks/useFetch";
import {GiftCard} from "../../interfaces/GiftCard";



var form:GiftCard={giftCardnumber:"", securityCode:""}

const submitUrl="https://eoysx40p399y9yl.m.pipedream.net/"

const GiftCardForm =()=>{   

    const[giftCardForm, setForm] = useState<GiftCard>(form)
    
    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setForm({
            ...giftCardForm,
            [event.target.name]: event.target.value,
        });
    };
    
    const {sendRequest, status, isLoading, error} = usePosthData<string>(submitUrl);

    const options: RequestInit = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(giftCardForm),
    };    

    useEffect(()=>{
        console.log('status:' + status)
        if(status === 200){
            navigate(routes.submit.routePath);
        }
    },[status])

 
    return ( 
        
        <div> 
            <div className="image-wrapper">
                <img src={giftCardIcon}  alt="" className="giftcard-Img" /> 
            </div>           

            {error === "" 
                ? <form className="payment-form">

                    <label className="title-label" htmlFor="giftCardOption"><b> Indtast gavekortinformationer </b></label>
                    <input
                        required
                        pattern="[0-9]{19}"
                        type="tel"
                        placeholder="Gavekortnummer"
                        id="giftCardnumber"
                        name="giftCardnumber"                    
                        onChange={onChange}                    
                    />
                    
                    
                    <div className="full-row">
                        <input
                            required
                            pattern="[0-9]{3}"
                            type="tel"
                            placeholder="Sikkerhedskode"
                            id="securityCode"
                            name="securityCode"                   
                            onChange={onChange}
                        />  
                        <button className="openButton" type="button"><i>Indløs</i></button>  
                    </div>

                    <div className="full-row">
                        {isLoading === false 
                            ?   <button className="confirm-payment-btn" 
                                    type="submit" 
                                    onClick={()=> sendRequest(options)}
                                    disabled={false} >
                                    Bekræft Betaling
                                </button>
                            :   <button className="confirm-payment-btn" 
                                    type="submit" 
                                    disabled={true}>
                                    <Beatloader/>                 
                                </button>
                        }                            
                    </div>
                            
                  </form>
                : ( <div className="full-row">
                        <p className="error-text">{error}</p>
                        <button className="confirm-payment-btn" onClick={()=> sendRequest(options)}>
                            Prøv igen
                        </button>
                    </div>
                   )
            }

        </div>
    );
}
 
export default GiftCardForm;


