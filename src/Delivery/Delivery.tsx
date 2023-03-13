import { Address } from "../interfaces/Address";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Delivery.css";
import { City } from "../interfaces/City";

type CityData = { [key: string]: City };

const Delivery = () => {
    const navigate = useNavigate();

    // Allows for separate billing and shipping city/zip-code data (for example from different countries)
    const [billingCityData, setBillingCityData] = useState<CityData>({});
    const [shippingCityData, setShippingCityData] = useState<CityData>({});

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
        const billingZipCode = billingCityData[billingAddress.zipCode];
        const shippingZipCode = shippingCityData[shippingAddress.zipCode];
        if (billingZipCode !== undefined && shippingZipCode !== undefined) {
            navigate("/payment");
        }
    };

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
        <div className="delivery">
            <form className="form" onSubmit={handleSubmit}>
                <div className="billingAddress">
                    <h2 className="address-row">Faktureringsadresse</h2>

                    <AddressDetails
                        address={billingAddress}
                        setAddress={(x: Address) => setBilling(x)}
                        check={check}
                        setCheck={(x: boolean) => setCheck(x)}
                        data={billingCityData}
                        setData={setBillingCityData}
                    />
                </div>

                <br />

                {!check && (
                    <div className="shippingAddress">
                        <h2 className="address-row">Leveringsadresse</h2>

                        <AddressDetails
                            address={shippingAddress}
                            setAddress={(x: Address) => setShipping(x)}
                            check={null}
                            setCheck={null}
                            data={shippingCityData}
                            setData={setShippingCityData}
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
    data,
    setData
}: {
    address: Address;
    setAddress: (value: Address) => void;
    check: boolean | null;
    setCheck: ((value: boolean) => void) | null;
    data: CityData;
    setData: (value: CityData) => void;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zipCodeError, setZipCodeError] = useState(false);

    useEffect(() => {
        const cityData: CityData = {};

        if (address.country === "Danmark") {
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
        const zip = data[event.target.value];
        if (zip !== undefined) {
            setAddress({
                ...address,
                [event.target.name]: event.target.value,
                city: zip.navn,
            });
        } else if (address.city !== "") {
            setAddress({
                ...address,
                [event.target.name]: event.target.value,
                city: "",
            });
        } else {
            setAddress({
                ...address,
                [event.target.name]: event.target.value,
            });
        }

        if (zip === undefined && event.target.value.length === 4) { 
            if (zipCodeError !== true) {
                setZipCodeError(true);
            }
        } else if (zipCodeError === true) {
            setZipCodeError(false);
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
                    pattern="[0-9]{8}"
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
                    pattern="[0-9]{8}"
                    type="text"
                    id="vatNr"
                    name="vatNr"
                    onChange={onChange}
                />
            </div>

            <div className="address-row">
                <label htmlFor="address1">Adresselinje 1</label>
                <input
                    required
                    type="text"
                    id="address1"
                    name="address1"
                    onChange={onChange}
                />
            </div>

            <div className="address-row">
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
                <span className="ziperror" hidden={!zipCodeError}>Det valgte postnummer er ikke korrekt!</span>
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
