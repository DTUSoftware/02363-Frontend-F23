import { useEffect, useState } from "react";
import { Order } from "../interfaces/Order";
import { CartItem } from "../interfaces/CartItem";
import { Address } from "../interfaces/Address";
import navigate from "../Navigation/navigate";
import { routes } from "../Navigation/RoutePaths";
import usePostData from "../hooks/useFetch";
import Beatloader from "../SpinnerAnimation/BeatLoader";
import "./Submit.css";

// RequestBin endpoint URL
const submitUrl = "https://eoysx40p399y9yl.m.pipedream.net";

/**
 * Submit component page where the user can agree to terms and conditions and submit their order
 */
function Submit({
    cartItems,
    billingAddress,
    shippingAddress,
    resetAfterSubmit,
}: {
    cartItems: CartItem[];
    billingAddress: Address;
    shippingAddress: Address;
    resetAfterSubmit: () => void;
}) {

    // useState hooks to for controlled input form
    const [marketing, setMarketing] = useState(false);
    const [terms, setTerms] = useState(false);
    const [comment, setComment] = useState("");

    // usePostData custom hook for sending http requests and receiving status codes, isLoading, and error states
    const { sendRequest, setError, status, isLoading, error } =
        usePostData<string>(submitUrl);

    // useEffect hook for navigating to the finish routePath upon a status code 200
    useEffect(() => {
        if (status === 200) {
            resetAfterSubmit();
            navigate(routes.finish.routePath);
        }
    }, [status]);

    
    const onChangeTerms = () => {
        setTerms(!terms);
    };

    const onChangeMarketing = () => {
        setMarketing(!marketing);
    };

    const changeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const orderDetails = cartItems.map((x) => {
            return {
                productId: x.product.id,
                quantity: x.quantity,
                giftWrap: x.giftWrap,
                recurringOrder: x.recurringOrder,
            };
        });
        const order: Order = {
            orderDetails: orderDetails,
            billingAddress: billingAddress,
            shippingAddress: shippingAddress,
            checkMarketing: marketing,
            submitComment: comment,
        };

        const options: RequestInit = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "cors",
            body: JSON.stringify(order),
        };

        sendRequest(
            options,
            "Vi beklager ulejligheden, noget gik galt ved indsendelsen af din ordre!"
        );
    };

    return (
        <div className="terms-box">
            <h2 className="address-row">Indsendelse af ordrer</h2>
            {error === "" ? (
                <form className="submit-form" onSubmit={handleSubmit}>
                    <div className="submitbox">
                        <p className="submitinfo">
                            Inden at du kan indsende din ordrer,{" "}
                            <strong> skal </strong> du acceptere
                            handelsbetingelserne for denne webshop. Du kan finde
                            mere information om siden handelsbetingelser{" "}
                            <a href="">her</a>.
                        </p>
                        <div>
                            <p className="checkbox-paragraf">
                                <input
                                    required
                                    type="checkbox"
                                    id="checkbox-terms"
                                    name="checkbox-terms"
                                    checked={terms}
                                    onChange={onChangeTerms}
                                />
                                <label
                                    htmlFor="checkbox-terms"
                                    id="checkbox-label"
                                    className="checkbox-label"
                                >
                                    Jeg accepterer vilkårene og betingelserne og
                                    privatlivsaftalen*
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
                                <label
                                    htmlFor="checkmarketing"
                                    id="checkbox-label"
                                    className="checkbox-label"
                                >
                                    Jeg accepterer at modtage marketingmails fra
                                    denne webshop
                                </label>
                            </p>
                        </div>
                        <div className="comment-box">
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
                        </div>
                    </div>
                    <div className="full-row-btn">
                        {!isLoading ? (
                            <button
                                className="send-order-btn"
                                id="confirm-payment"
                                disabled={isLoading}
                                type="submit"
                            >
                                Indsend ordrer
                            </button>
                        ) : (
                            <button className="send-order-btn" 
                                type="submit"
                                disabled={true}>
                                <Beatloader/>                 
                            </button>
                            )
                        }
                    </div>
                </form>
            ) : (
                <div>
                    <p className="error-message">{error}</p>
                    <button onClick={() => setError("")}>Prøv igen</button>
                </div>
            )}
        </div>
    );
}

export default Submit;
