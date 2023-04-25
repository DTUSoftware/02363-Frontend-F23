import { useEffect, useState } from "react";
import bankcardsImg from "../../assets/bankcardIcons.png";
import navigate from "../../Navigation/navigate";
import { CreditCard } from "../../interfaces/CreditCard";
import { routes } from "../../Navigation/RoutePaths";
import usePostData from "../../hooks/useFetch";
import Beatloader from "../../SpinnerAnimation/BeatLoader";
import  "./style.css"

const payment: CreditCard = {
    cardNumber: "",
    cvcNumber: "",
    expiryMonth: "01",
    expiryYear: "23",
};

const submitUrl = "https://eoysx40p399y9yl.m.pipedream.net";

function CreditCardForm() {
    const [customerPayment, setCustomerPayment] = useState<CreditCard>(payment);
    const {sendRequest, setError, status, isLoading, error} = usePostData<string>(submitUrl);

    useEffect(()=>{
        if(status === 200){
            navigate(routes.submit.routePath);
        }
    },[status])    

    const handleSubmit =async (event:React.FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
        const options: RequestInit = {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            mode: "cors",
            body: JSON.stringify(customerPayment),
        };

        sendRequest(options, "Vi beklager ulejligheden, noget gik galt ved indsendelsen af din betaling med kort!");
    }
    

    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setCustomerPayment({
            ...customerPayment,
            [event.target.name]: event.target.value,
        });
    };

    const onSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setCustomerPayment({
            ...customerPayment,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <div className="payment">
            <div className="img-wrapper">
                <img src={bankcardsImg}  alt="" className="bankcards-Img" /> 
            </div> 

            {error === "" ? (
                <form className="payment-form" onSubmit={handleSubmit}>
                    <div className="payment-block">

                        <label className="title-label" id= "full-row-label">Kort oplysninger</label>                        
                        
                        <div className="paymentblock">
                            <label htmlFor="expiryMonth">
                                Udløbsmåned
                            </label>

                            <select
                                autoFocus
                                required
                                className="dropdownpayment"
                                id="expiryMonth"
                                name="expiryMonth"
                                onChange={onSelect}
                            >
                                <option> 01 </option>
                                <option> 02 </option>
                                <option> 03 </option>
                                <option> 04 </option>
                                <option> 05 </option>
                                <option> 06 </option>
                                <option> 07 </option>
                                <option> 08 </option>
                                <option> 09 </option>
                                <option> 10 </option>
                                <option> 11 </option>
                                <option> 12 </option>
                            </select>
                        </div>
                        <div className="paymentblock">
                        <label htmlFor="expiryYear">
                                Udløbsår
                            </label>

                            <select
                                required
                                className="dropdownpayment"
                                id="expiryYear"
                                name="expiryYear"
                                onSelect={onSelect}
                            >
                                <option> 23 </option>
                                <option> 24 </option>
                                <option> 25 </option>
                                <option> 26 </option>
                                <option> 27 </option>
                                <option> 28 </option>
                                <option> 29 </option>
                                <option> 30 </option>
                                <option> 31 </option>
                                <option> 32 </option>
                                <option> 33 </option>
                                <option> 34 </option>
                                <option> 35 </option>
                            </select>
                        </div>
                       
                        <div className="paymentblock">
                            <label htmlFor="cardNumber">
                                Kortnummer
                            </label>

                            <input
                                required
                                type="tel"
                                name="cardNumber"
                                id="cardNumber"
                                minLength={15} //American Express
                                maxLength={16} //Others
                                onChange={onChange}
                            />
                        </div>

                        <div className="paymentblock">
                            <label  htmlFor="cvcNumber">                               
                                CVC
                            </label>
                            <input
                                className="cvcfield"
                                required
                                pattern="[0-9]{3}"
                                type="tel"
                                maxLength={3}
                                id="cvcNumber"
                                name="cvcNumber"
                                onChange={onChange}
                            />
                        </div>
                        <div className="full-row-btn">
                            {!isLoading ? (
                                <button
                                    className="confirm-payment-btn"
                                    id="confirm-payment"
                                    disabled={isLoading}
                                    type="submit"
                                >
                                    Bekræft Betaling
                                </button>
                            ) : (
                                <button className="confirm-payment-btn" 
                                    type="submit"
                                    disabled={true}>
                                    <Beatloader/>                 
                                </button>
                                )
                            }
                        </div>
                    </div>
                </form>
            ) : (
                <div className="error-text">
                    <p>{error}</p>
                    <button className="confirm-payment-btn" onClick={()=>setError("")}>
                        Prøv igen
                    </button>
                </div>
            )}
        </div>
    );
}

export default CreditCardForm;
