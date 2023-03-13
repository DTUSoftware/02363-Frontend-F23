import { Address } from "../interfaces/Address";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Delivery.css";
import { City } from "../interfaces/City";

type CityData = { [key: string]: City };

const address: Address = {
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
};

const Delivery = () => {
    const navigate = useNavigate();

    // Allows for separate billing and shipping city/zip-code data (for example from different countries)
    const [billingCityData, setBillingCityData] = useState<CityData>({});
    const [shippingCityData, setShippingCityData] = useState<CityData>({});

    const [check, setCheck] = useState(false);
    const [billingAddress, setBilling] = useState<Address>(address);

    const [shippingAddress, setShipping] = useState<Address>(address);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const billingZipCode = billingCityData[billingAddress.zipCode];
        const shippingZipCode = shippingCityData[shippingAddress.zipCode];
        if (billingZipCode !== undefined && shippingZipCode !== undefined) {
            navigate("/payment");
        }
    };

    useEffect(() => {
        if (check) {
            setShipping(billingAddress);
        } else {
            setShipping(address);
        }
    }, []);

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

                {check && (
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
    setData,
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

    const isShipping = check !== null && setCheck !== null;

    useEffect(() => {
        const cityData: CityData = {};

        if (address.country === "Danmark") {
            setIsLoading(true);
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
                    data.forEach((city) => {
                        cityData[city.nr] = city;
                    });
                    setData(cityData);
                    setIsLoading(false);
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
                <label
                    htmlFor={!isShipping ? "shippingFirstName" : "firstName"}
                >
                    Fornavn
                </label>
                <input
                    required
                    type="text"
                    id={!isShipping ? "shippingFirstName" : "firstName"}
                    name={!isShipping ? "shippingFirstName" : "firstName"}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor={!isShipping ? "shippingLastName" : "lastName"}>
                    Efternavn
                </label>
                <input
                    required
                    type="text"
                    id={!isShipping ? "shippingLastName" : "lastName"}
                    name={!isShipping ? "shippingLastName" : "lastName"}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor={!isShipping ? "shippingEmail" : "email"}>
                    Email
                </label>
                <input
                    required
                    type="email"
                    id={!isShipping ? "shippingEmail" : "email"}
                    name={!isShipping ? "shippingEmail" : "email"}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor={!isShipping ? "shippingMobileNr" : "mobileNr"}>
                    Mobilnummer
                </label>
                <input
                    required
                    pattern="[0-9]{8}"
                    type="tel"
                    id={!isShipping ? "shippingMobileNr" : "mobileNr"}
                    name={!isShipping ? "shippingMobileNr" : "mobileNr"}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor={!isShipping ? "shippingCompany" : "company"}>
                    Evt. firmanavn
                </label>
                <input
                    required
                    type="text"
                    id={!isShipping ? "shippingCompany" : "company"}
                    name={!isShipping ? "shippingCompany" : "company"}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor={!isShipping ? "shippingVatNr" : "vatNr"}>
                    VirksomhedVAT-nummer
                </label>
                <input
                    required
                    pattern="[0-9]{8}"
                    type="text"
                    id={!isShipping ? "shippingVatNr" : "vatNr"}
                    name={!isShipping ? "shippingVatNr" : "vatNr"}
                    onChange={onChange}
                />
            </div>

            <div className="address-row">
                <label htmlFor={!isShipping ? "shippingAddress1" : "address1"}>
                    Adresselinje 1
                </label>
                <input
                    required
                    type="text"
                    id={!isShipping ? "shippingAddress1" : "address1"}
                    name={!isShipping ? "shippingAddress1" : "address1"}
                    onChange={onChange}
                />
            </div>

            <div className="address-row">
                <label htmlFor={!isShipping ? "shippingAddress2" : "address2"}>
                    Adresselinje 2
                </label>
                <input
                    required
                    type="text"
                    id={!isShipping ? "shippingAddress2" : "address2"}
                    name={!isShipping ? "shippingAddress2" : "address2"}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor={!isShipping ? "shippingZipCode" : "zipCode"}>
                    Postnummer
                </label>
                <input
                    disabled={isLoading}
                    required
                    type="text"
                    pattern="[0-9]{4}"
                    id={!isShipping ? "shippingZipCode" : "zipCode"}
                    name={!isShipping ? "shippingZipCode" : "zipCode"}
                    onChange={onChangeSelect}
                />
                <span className="ziperror" hidden={!zipCodeError}>
                    Det valgte postnummer er ikke korrekt!
                </span>
            </div>

            <div>
                <label htmlFor={!isShipping ? "shippingCity" : "city"}>
                    By
                </label>
                <input
                    readOnly
                    type="text"
                    id={!isShipping ? "shippingCity" : "city"}
                    name={!isShipping ? "shippingCity" : "city"}
                    value={address.city}
                />
            </div>

            <div>
                <label htmlFor={!isShipping ? "shippingContry" : "country"}>
                    Land
                </label>
                <input
                    required
                    type="text"
                    id={!isShipping ? "shippingContry" : "country"}
                    name={!isShipping ? "shippingContry" : "country"}
                    disabled
                    value={address.country}
                    onChange={onChange}
                />
            </div>

            <div>
                {isShipping && <CheckBox check={check} setCheck={setCheck} />}
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
                name="checkbox"
                id="checkbox"
                value="false"
                onChange={() => setCheck(!check)}
            />
            <label htmlFor="checkbox" id="checkbox-label">
                Min leveringsadresse er en anden end min faktureringsadresse
            </label>
        </div>
    );
}

export default Delivery;
