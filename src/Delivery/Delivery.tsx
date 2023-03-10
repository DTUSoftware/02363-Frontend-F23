import { Address } from "../interfaces/Address";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Delivery.css";
import { City } from "../interfaces/City";

type CityData = { [key: string]: City };

const Delivery = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<CityData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zipCodeError, setZipCodeError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [check, setCheck] = useState(false);
    const [billingAddress, setBilling] = useState<Address>({
        firstName: "",
        lastName: "",
        email: "",
        mobileNr: 0,
        company: "",
        vatNr: "",
        country: "Danmark",
        zipCode: "",
        city: "",
        address1: "",
        address2: "",
    });

    const [shippingAddress, setShipping] = useState<Address>({
        firstName: "",
        lastName: "",
        email: "",
        mobileNr: 0,
        company: "",
        vatNr: "",
        country: "Danmark",
        zipCode: "",
        city: "",
        address1: "",
        address2: "",
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await saveToDB();
        navigate("/payment");
    };

    async function saveToDB() {}

    if (check) {
        shippingAddress.firstName = billingAddress.firstName;
        shippingAddress.lastName = billingAddress.lastName;
        shippingAddress.email = billingAddress.email;
        shippingAddress.mobileNr = billingAddress.mobileNr;
        shippingAddress.company = billingAddress.company;
        shippingAddress.vatNr = billingAddress.vatNr;
        shippingAddress.address1 = billingAddress.address1;
        shippingAddress.address2 = billingAddress.address2;
        shippingAddress.zipCode = billingAddress.zipCode;
        shippingAddress.city = billingAddress.city;
        shippingAddress.country = billingAddress.country;
    }

    return (
        <div>
            <form className="form" onSubmit={handleSubmit}>
                <div className="billingAddress">
                    <h2 className="full-width">Faktureringsadresse</h2>

                    <AddressDetails
                        address={billingAddress}
                        setAddress={(x: Address) => setBilling(x)}
                        check={check}
                        setCheck={(x: boolean) => setCheck(x)}
                    />
                </div>

                <br />

                {!check && (
                    <div className="shippingAddress">
                        <h2 className="full-width">Leveringsadresse</h2>

                        <AddressDetails
                            address={shippingAddress}
                            setAddress={(x: Address) => setShipping(x)}
                            check={null}
                            setCheck={null}
                        />
                    </div>
                )}

                <br />
                <button className="payment-btn" type="submit">
                    Gå til betaling
                </button>
            </form>
        </div>
    );
};

function AddressDetails({
    address,
    setAddress,
    check,
    setCheck,
}: {
    address: Address;
    setAddress: (value: Address) => void;
    check: boolean | null;
    setCheck: ((value: boolean) => void) | null;
}) {
    const [data, setData] = useState<CityData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zipCodeError, setZipCodeError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    useEffect(() => {
        const cityData: CityData = {};

        if (address.country === "Danmark") {
            console.log("Fetching!");
            fetch("https://api.dataforsyningen.dk/postnumre")
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw Error(
                        "It is not possible to fetch the data from the API"
                    );
                })
                .then((data: City[]) => {
                    setIsLoading(false);
                    data.forEach((city) => {
                        cityData[city.nr] = city;
                    });
                    setData(cityData);
                    setError(null);
                })
                .catch((er) => {
                    setIsLoading(false);
                    setError(er);
                });
        }
    }, []);

    const onChangeSelect = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setAddress({
            ...address,
            [event.target.name]: event.target.value,
        });
        const zip = data[event.target.value];
        if (zip !== undefined) {
            setAddress({
                ...address,
                city: zip.navn,
            });
        } else if (address.city !== "") {
            setAddress({
                ...address,
                city: "",
            });
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setAddress({
            ...address,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <div className="address">
            <div>
                <label htmlFor="firstName">Fornavn</label>
                <input
                    required
                    type="text"
                    id="firstName"
                    name="firstName"
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor="lastName">Efternavn</label>
                <input
                    required
                    type="text"
                    id="lastName"
                    name="lastName"
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor="mobileNr">Mobilnummer</label>
                <input
                    required
                    type="tel"
                    id="mobileNr"
                    name="mobileNr"
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor="company">Evt. firmanavn</label>
                <input
                    required
                    type="text"
                    id="company"
                    name="company"
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor="vatNr">VirksomhedVAT-nummer</label>
                <input
                    required
                    pattern="\d{8}|\d{8}"
                    type="text"
                    id="vatNr"
                    name="vatNr"
                    onChange={onChange}
                />
            </div>

            <div className="full-width">
                <label htmlFor="address1">Adresselinje 1</label>
                <input
                    required
                    type="text"
                    id="address1"
                    name="address1"
                    onChange={onChange}
                />
            </div>

            <div className="full-width">
                <label htmlFor="address2">Adresselinje 2</label>
                <input
                    required
                    type="text"
                    id="address2"
                    name="address2"
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor="zipCode">Postnummer</label>
                <input
                    required
                    type="text"
                    pattern="[0-9]{4}"
                    id="zipCode"
                    name="zipCode"
                    onChange={onChangeSelect}
                />
            </div>

            <div>
                <label htmlFor="city">By</label>
                <input readOnly id="city" name="city" value={address.city} />
            </div>

            <div>
                <label htmlFor="country">Land</label>
                <input
                    required
                    type="text"
                    id="country"
                    name="country"
                    disabled
                    value={address.country}
                    onChange={onChange}
                />
            </div>

            <div>
                {check !== null && setCheck !== null && (
                    <CheckBox check={check} setCheck={setCheck} />
                )}
            </div>
        </div>
    );
}

function CheckBox({
    check,
    setCheck,
}: {
    check: boolean;
    setCheck: (value: boolean) => void;
}) {
    return (
        <div>
            <br />
            <br />
            <input
                type="checkbox"
                name="check"
                value="false"
                onChange={() => setCheck(!check)}
            />
            <label htmlFor="checkbox" id="checkbox-label">
                Min leveringsadresse er den samme som min faktureringsadresse
            </label>
        </div>
    );
}

export default Delivery;
