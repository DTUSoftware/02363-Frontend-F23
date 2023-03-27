import "./Payment.css";
import { useState } from "react";
import card_americanexpress from './assets/americanexpress_logo.png';
import card_dankort from './assets/dankort_logo.png';
import card_mastercard from './assets/mastercard_logo.png';
import navigate from "../Navigation/navigate";
import { CustomerPayment } from "../interfaces/CustomerPayment";

const payment: CustomerPayment = {
    cardNumber: "",
    cvcNumber: "",
    expiryMonth: "01",
    expiryYear: "23",
}

function Payment() {
    const [customerPayment, setCustomerPayment] = useState<CustomerPayment>(payment);
    //const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate("/submit");
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setCustomerPayment({
            ...customerPayment,
            [event.target.name]: event.target.value,
        });
    };

    const onSelect = (
        event: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setCustomerPayment({
            ...customerPayment,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="payment">
                <h2 className="fullrow">Kort oplysninger</h2>
                <label className="fullrow" htmlFor="cardNumber">Kortnummer</label>
                <div className="cardinformation">
                    <input
                        autoFocus
                        required
                        type="text"
                        name="cardNumber"
                        id="cardNumber"
                        minLength={15} //American Express
                        maxLength={16} //Others
                        onChange={onChange}
                    />
                </div>
                <label className="paymentblock" htmlFor="expiryMonth">Udløbsmåned</label> <label className="paymentblock" htmlFor="expiryYear">Udløbsår</label>

                <div className="paymentblock">
                    <select required className="dropdownpayment" id="expiryMonth" name="expiryMonth" onChange={onSelect}>
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
                    <select required className="dropdownpayment" id="expiryYear" name="expiryYear" onSelect={onSelect}>
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
                <label className="fullrow" htmlFor="cvcNumber"> CVC</label>
                <div className="fullrow">
                    <input className="cvcfield"
                        required
                        pattern="[0-9]{3}"
                        type="text"
                        maxLength={3}
                        id="cvcNumber"
                        name="cvcNumber"
                        onChange={onChange}
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