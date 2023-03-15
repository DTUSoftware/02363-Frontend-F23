import { Address } from "../interfaces/Address";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Delivery.css";
import { City } from "../interfaces/City";
import useFetchData from "../hooks/useFetchData";

type CityData = { [key: string]: City };

const Delivery = ({billingAddress, setBilling, shippingAddress, setShipping, address, check, setCheck} : {billingAddress: Address, setBilling: (address: Address) => void, shippingAddress: Address, setShipping: (address: Address) => void, address: Address, check: boolean, setCheck: (check: boolean) => void }) => {
    const navigate = useNavigate();

    // Allows for separate billing and shipping city/zip-code data (for example from different countries)
    const [billingCityData, setBillingCityData] = useState<CityData>({});
    const [shippingCityData, setShippingCityData] = useState<CityData>({});

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const billingZipCode = billingCityData[billingAddress.zipCode];
        const shippingZipCode = shippingCityData[shippingAddress.zipCode];
        if (billingZipCode !== undefined && shippingZipCode !== undefined) {
            if (!check) {
                setShipping({...billingAddress});
            }
            navigate("/payment");
        }
    };

    useEffect(() => {
        if (!check) {
            setShipping(address);
        }
    }, [check, billingAddress]);

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
                        cityData={billingCityData}
                        setCityData={setBillingCityData}
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
                            cityData={shippingCityData}
                            setCityData={setShippingCityData}
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
    cityData,
    setCityData,
}: {
    address: Address;
    setAddress: (value: Address) => void;
    check: boolean | null;
    setCheck: ((value: boolean) => void) | null;
    cityData: CityData;
    setCityData: (value: CityData) => void;
}) {
    
    const [zipCodeError, setZipCodeError] = useState(false);

    const isShipping = check !== null && setCheck !== null;

    const {data, isLoading, error}= useFetchData<City[]>("https://api.dataforsyningen.dk/postnumre",[]);

    useEffect(() => {
        const cityData: CityData = {};
        data.forEach(city => {
            cityData[city.nr]=city;
        });
        setCityData(cityData);
    },[data]);



    const onChangeSelect = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const zip = cityData[event.target.value];
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
                    name="firstName"
                    value={address.firstName}
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
                    name="lastName"
                    value={address.lastName}
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
                    name="email"
                    value={address.email}
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
                    name="mobileNr"
                    value={address.mobileNr !== 0 ? address.mobileNr : ""}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor={!isShipping ? "shippingCompany" : "company"}>
                    Evt. firmanavn
                </label>
                <input
                    type="text"
                    id={!isShipping ? "shippingCompany" : "company"}
                    name="company"
                    value={address.company}
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
                    name="vatNr"
                    value={address.vatNr}
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
                    name="address1"
                    value={address.address1}
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
                    name="address2"
                    value={address.address2}
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
                    name="zipCode"
                    value={address.zipCode}
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
                    name="city"
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
                    name="country"
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
                checked={check}
                onChange={() => setCheck(!check)}
            />
            <label htmlFor="checkbox" id="checkbox-label">
                Min leveringsadresse er en anden end min faktureringsadresse
            </label>
        </div>
    );
}

export default Delivery;
