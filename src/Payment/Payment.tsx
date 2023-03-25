import "./Payment.css";
import { useEffect, useState } from "react";
import Link from "../Navigation/Link";
import card_americanexpress from './assets/americanexpress_logo.png';
import card_dankort from './assets/dankort_logo.png';
import card_mastercard from './assets/mastercard_logo.png';
import navigate from "../Navigation/navigate";
function Payment() {

    const [cardNumber, setCardNumber] = useState("");
    const [cvcNumber, setCvcNumber] = useState("");
    //const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        navigate("/submit");

    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="payment">
                <h2 className="fullrow">Kort oplysninger</h2>
                <h3 className="fullrow">Kortnummer</h3>
                <div className="cardinformation">
                    <label htmlFor="cardNumber"></label>
                    <input
                        autoFocus
                        required
                        type="text"
                        name="cardNumber"
                        minLength={15} //American Express
                        maxLength={16} //Others
                        value={cardNumber}
                        onChange={(e) =>
                            setCardNumber(e.target.value)
                        }

                    />
                </div>
                <h3 className="paymentblock">Udløbsmåned</h3><h3 className="paymentblock">Udløbsår</h3>

                <div className="paymentblock">
                    <label htmlFor="ExpiryMonth"></label>
                    <select className="dropdownpayment" >
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
                    <label htmlFor="ExpiryYear"></label>
                    <select className="dropdownpayment" >
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
                <h3 className="fullrow">
                    <label htmlFor="CVC"> CVC</label>
                </h3>
                <div className="fullrow">
                    <input className="cvcfield"

                        required
                        pattern="[0-9]{3}"
                        type="text"
                        maxLength={3}
                        name="cvcNumber"
                        value={cvcNumber}
                        onChange={(e) => setCvcNumber(e.target.value)}
                    />
                </div>
                <div className="fullrow">
                    <button
                        className="confirm_payment"
                        type="submit"
                    >
                        Bekræft Betaling
                    </button>
                </div>

            </div>
        </form>

    )
}



export default Payment;