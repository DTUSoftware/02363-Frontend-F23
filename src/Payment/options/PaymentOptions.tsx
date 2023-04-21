import "./PaymentOptions.css"
const PaymentOptions = ({paymentType,setPaymentType}:{paymentType:string, setPaymentType:(type: string) => void}) => 
{
    const onChangePayment = (event : React.ChangeEvent<HTMLInputElement>) => {
        setPaymentType(event.currentTarget.value);
    };
     return(
        <div className="options">

            <div className="option">
                <label htmlFor="creditCard">Credit Card</label>
                <input type="radio" id="creditCard" value="creditCard" checked={paymentType === "creditCard"} onChange={onChangePayment}/>
            </div>

            <div className="option">
                <label htmlFor="mobilePay">MobilePay</label>
                <input type="radio" id="mobilePay" value="mobilePay" checked={paymentType === "mobilePay"} onChange={onChangePayment}/>                
            </div>

            <div className="option">
                <label htmlFor="giftCard">Gift Card</label>
                <input type="radio" id="giftCard" value="giftCard" checked={paymentType === "giftCard"} onChange={onChangePayment}/>                
            </div>

        </div>
     );

}
export default PaymentOptions;