import { useState } from "react";
import PaymentOptions from "./options/PaymentOptions";
import CreditCardForm from "./forms/CreditCard/CreditCardForm";
import MobilePayForm from "./forms/MobilepayForm";
import GiftCardForm from "./forms/GiftCardForm";
import "./Payment.css";

const Payment = () => {

    const[paymentType, setPaymentType]= useState('creditCard');

    return ( 
        <div className="payment">
            <PaymentOptions paymentType={paymentType} setPaymentType={setPaymentType}/>

            {paymentType == "creditCard" && <CreditCardForm/>}
            {paymentType == "mobilePay" && <MobilePayForm/>}
            {paymentType == "giftCard" && <GiftCardForm/>}
        </div>
     );
}
 
export default Payment;