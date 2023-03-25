import navigate from "../Navigation/navigate";
import "./Finish.css";


function Finish() {
    const continueShopping = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate("/");
    };

    return (
        <div className="finish-box">
            <h2>Mange tak!</h2>
            <p>Din er order er nu bestilt.</p>
            <p>Tjek din email for kvittering.</p>
            <button className="payment-btn" onClick={continueShopping}>
                Shop videre?
            </button>
        </div>
    );
}

export default Finish;