import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import mobilepayImg from "../../assets/mobilepayicon.svg"
import navigate from "../../Navigation/navigate";
import { routes } from "../../Navigation/RoutePaths";
import usePostData from "../../hooks/useFetch"
import BeatLoader from "../../SpinnerAnimation/BeatLoader";
import { MobilePay } from "../../interfaces/MobilePay";
import  "./style.css"

const submitUrl="https://eoysx40p399y9yl.m.pipedream.net/"

var form:MobilePay={mobilePayNumber:"", check:false}

const MobilePayForm = () => {

    const[mobilePayForm, setForm]= useState<MobilePay>(form);
    const {sendRequest, status, isLoading, error} = usePostData<string>(submitUrl);

    const options: RequestInit = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mobilePayForm),
    };
   
    useEffect(()=>{
        console.log('options: '+ options.body)
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
                        <PhoneInput country={'dk'}  value={mobilePayForm.mobilePayNumber}  onChange={phone=>  setForm({...mobilePayForm, mobilePayNumber: phone})} />
                    </div> 

                    <div className="full-row">
                        <input
                            type="checkbox"
                            name="checkbox"
                            id="checkbox"  
                            checked={(mobilePayForm.check)}
                            onChange={()=> setForm({...mobilePayForm, check: !(mobilePayForm.check)})}
                        />
                        <label htmlFor="checkbox" className="checkbox-label">
                            <i>Husk mig til næste gang</i>
                        </label>
                    </div> 

                    <div className="full-row">
                        {isLoading === false 
                            ?   <button className="confirm-payment-btn" 
                                    type="submit" 
                                    onClick={()=>sendRequest(options)}
                                    disabled={false} >
                                    Bekræft Betaling
                                </button>
                            :   <button className="confirm-payment-btn" 
                                    type="submit" 
                                    disabled={true}>
                                    <BeatLoader/>
                                </button>
                        }
                    </div>  

                  </form> 
                : ( 
                    <div className="full-row">
                        <p className="error-text">{error}</p>
                        <button className="confirm-payment-btn" onClick={()=>sendRequest(options)}>
                            Prøv igen
                        </button>
                    </div>
                )
            }
        </div>   
    );
}
 
export default MobilePayForm;