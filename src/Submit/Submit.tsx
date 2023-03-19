import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "../interfaces/Order"
import { CartItem } from "../interfaces/CartItem"
import "./Submit.css";
import { Address } from "../interfaces/Address";

const submitUrl = "https://eoysx40p399y9yl.m.pipedream.net";

function Submit({cartItems, billingAddress, shippingAddress} : {cartItems: CartItem[], billingAddress: Address, shippingAddress: Address}) {
    const navigate = useNavigate();
    const [marketing, setMarketing] = useState(false);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const order: Order = {
            cartItems: cartItems,
            billingAddress: billingAddress,
            shippingAddress: shippingAddress,
            checkMarketing: marketing,
            submitComment: comment
        }
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        const options: RequestInit = {
            method: "POST",
            headers,
            mode: "cors",
            body: JSON.stringify(order),
        }
        await fetch(submitUrl, options)
                .then((response) => {
                    if (response.ok) {
                        return;
                    }
                    throw Error(
                        "This request failed and no data was sent!"
                    );
                })
                .then(() =>{
                    setIsLoading(false);
                    setError(null);
                    navigate("/finish");
                })
                .catch((er) => {
                    setIsLoading(false);
                    setError(er);
                });
    };

    const onChangeMarketing = () => {
        setMarketing(!marketing);
    };

    const changeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    };

    const retryButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setError(null);
    };

    return (
        <div className="terms-box">
            <h2 className="address-row">Indsendelse af order</h2>
            {error === null ? 
            <form className="form" onSubmit={handleSubmit}>
                <div className="submitbox">
                    <p className="submitinfo">
                        Inden at du kan indsende din order, SKAL du acceptere handelsbetingelserne for denne webshop. 
                        Du kan finde mere information om siden handelsbetingelser <a href="">her</a>. 
                    </p>
                    <p className="checkbox-paragraf">
                        <input
                            required
                            type="checkbox"
                            id="checkbox-terms"
                            name="checkbox-terms"
                        />
                        <label htmlFor="checkbox-terms" id="checkbox-label">
                            Jeg accepterer vilkårene og betingelserne og privatlivsaftalen.
                        </label>
                    </p>
                    <p className="checkbox-paragraf">
                        <input
                            type="checkbox"
                            id="checkmarketing"
                            name="checkmarketing"
                            checked={marketing}
                            onChange={onChangeMarketing}
                        />
                        <label htmlFor="checkmarketing" id="checkbox-label">
                            Jeg accepterer at modtage marketingmails fra denne webshop.
                        </label>
                    </p>
                    <p>
                        <label htmlFor="submitcomment" id="submit-label">
                            Tilføj en yderligere kommentar
                        </label>
                        <textarea 
                            rows={4}
                            id="submitcomment"
                            className="submitcomment"
                            name="submitcomment"
                            placeholder={"Indtast kommentar her..."}
                            value={comment}
                            onChange={changeTextArea}
                        />
                    </p>
                </div>
                {!isLoading ?
                <button className="payment-btn" disabled={isLoading} type="submit">
                    Indsend order
                </button>
                :
                <p>Loading...</p> 
                }
            </form>
            :
            <div>
                <p>Vi beklager ulejligheden, noget gik galt.</p>
                <p>Prøv venligst igen om et par minutter.</p>
                <button className="payment-btn" onClick={retryButton}>
                    Prøv igen
                </button>
            </div>
            }
        </div>
    );
}

export default Submit;