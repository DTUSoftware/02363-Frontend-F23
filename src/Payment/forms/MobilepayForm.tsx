import { useEffect, useState } from "react";
import  "./Forms.css"
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import mobilepayImg from "../../assets/mobilepayicon.svg"
import navigate from "../../Navigation/navigate";
import { routes } from "../../Navigation/RoutePaths";
import RoundLoader from "../../SpinnerAnimation/RounedLoader";
import usePosthData from "../../hooks/useFetch"
import BeatLoader from "../../SpinnerAnimation/BeatLoader";

const url="https://eoysx40p399y9yl.m.pipedream.net/"

const MobilePayForm = () => {

    const[mobilePayNumber, setMobilePayNumber]= useState("");
    const[check, setCheck]= useState(false);

    const options: RequestInit = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mobilePayNumber),
    };

    const {sendRequest, status, isLoading, error} = usePosthData<string>(url, options);
    useEffect(()=>{
        console.log('status:' + status)
        if(status === 200){
            navigate(routes.submit.routePath);
        }
    },[status])
    
    return (         
        <div> 
            <div className="img-wrapper">
                <img src={mobilepayImg}  alt="" className="mobilepay-Img" /> 
            </div>          
            
            <h3><b>Betale via MobilePay</b></h3>
            <br></br>
            
            {error === ""
                ? <form className="payment-form">                          

                    <label className="title-label" htmlFor="mobilePayOption">
                    <b><i>Indtast dit mobilnummer</i></b> 
                    </label> 

                    <div className="full-row">
                        <PhoneInput country={'dk'}  value={mobilePayNumber}  onChange={phone => setMobilePayNumber(phone)} />
                    </div> 

                    <div className="full-row">
                        <input
                            type="checkbox"
                            name="checkbox"
                            id="checkbox"
                            checked={check}
                            onChange={() => setCheck(!check)}
                        />
                        <label htmlFor="checkbox" className="checkbox-label">
                            <i>Husk mig til næste gang</i>
                        </label>
                    </div> 

                    <div className="full-row">
                        {isLoading === false 
                            ?   <button className="confirm_payment" 
                                    type="submit" 
                                    onClick={()=> sendRequest()}
                                    disabled={false} >
                                    Bekræft Betaling
                                </button>
                            :   <button className="confirm_payment" 
                                    type="submit" 
                                    disabled={true}>
                                    <BeatLoader/>
                                </button>
                        }
                    </div>  

                  </form> 
                : <h2> {error} </h2>
            }
        </div>   
    );
}
 
export default MobilePayForm;