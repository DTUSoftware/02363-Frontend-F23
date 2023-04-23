import { useState } from "react";
import PaymentOptions from "./options/PaymentOptions";
import CreditCardForm from "./forms/CreditCardForm";
import MobilePayForm from "./forms/MobilepayForm";
import GiftCardForm from "./forms/GiftCardForm";
import { PaymentType } from "./options/PaymentType";
import  "./Payment.css"

const Payment = () => {

    const[paymentType, setPaymentType]= useState<string>(PaymentType.creditCard);

    return ( 
        <div className="payment">
            <PaymentOptions paymentType={paymentType} setPaymentType={setPaymentType}/>

            {paymentType === PaymentType.creditCard && <CreditCardForm/>}
            {paymentType === PaymentType.mobilePay && <MobilePayForm/>}
            {paymentType === PaymentType.giftcard && <GiftCardForm/>}
        </div>
     );
}
 
export default Payment;