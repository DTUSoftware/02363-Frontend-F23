import { Address } from "../interfaces/Address";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Delivery.css";

const Delivery = () => {
    const [check, setCheck] = useState(false);

    const navigate = useNavigate();

    const [shippingAddress, setShipping] = useState<Address>({
        firstName: "",
        lastName: "",
        email: "",
        mobileNr: 0,
        company: "",
        vatNr: 0,
        country: "",
        region: "",
        zipCode: 0,
        city: "",
        address1: "",
        address2: "",
    });

    const [billingAddress, setBilling] = useState<Address>({
        firstName: "",
        lastName: "",
        email: "",
        mobileNr: 0,
        company: "",
        vatNr: 0,
        country: "",
        region: "",
        zipCode: 0,
        city: "",
        address1: "",
        address2: "",
    });

    const onChangeBilling = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setBilling({
            ...billingAddress,
            [event.target.name]: event.target.value,
        });
    };

    const onChangeShipping = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setShipping({
            ...shippingAddress,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await saveToDB();
        navigate("/payment");
    };

    async function saveToDB() {}

    if (check) {
        billingAddress.firstName = shippingAddress.firstName;
        billingAddress.lastName = shippingAddress.lastName;
        billingAddress.email = shippingAddress.email;
        billingAddress.mobileNr = shippingAddress.mobileNr;
        billingAddress.company = shippingAddress.company;
        billingAddress.vatNr = shippingAddress.vatNr;
        billingAddress.address1 = shippingAddress.address1;
        billingAddress.address2 = shippingAddress.address2;
        billingAddress.zipCode = shippingAddress.zipCode;
        billingAddress.city = shippingAddress.city;
        billingAddress.country = shippingAddress.country;
        billingAddress.region = shippingAddress.region;
    }

    return (
        <div className="delivery">
            <form className="form" onSubmit={handleSubmit}>
                <div className="shippingAddress">
                    <table cellSpacing="2" align="center" cellPadding="8">
                        <thead>
                            <tr>
                                <td>
                                    <h2>Shipping Address</h2>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> Firstname</td>
                                <td>
                                    <input
                                        required
                                        autoFocus
                                        name="firstName"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter your firstname"
                                        id="fn1"
                                    />
                                </td>
                                <td> Lastname</td>
                                <td>
                                    <input
                                        required
                                        name="lastName"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter your lastname"
                                        id="ln1"
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Email </td>
                                <td>
                                    <input
                                        required
                                        name="email"
                                        onChange={onChangeShipping}
                                        type="email"
                                        placeholder="Enter your email"
                                        id="e1"
                                    />
                                </td>
                                <td>Mobile nr </td>
                                <td>
                                    <input
                                        required
                                        name="mobileNr"
                                        onChange={onChangeShipping}
                                        type="tel"
                                        placeholder="Enter your telephone"
                                        id="m1"
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Company name</td>
                                <td>
                                    <input
                                        required
                                        name="company"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter the name of your company"
                                    />
                                </td>

                                <td>Company VAT number</td>
                                <td>
                                    <input
                                        required
                                        name="vatNr"
                                        onChange={onChangeShipping}
                                        type="number"
                                        placeholder="Enter your company VAT number"
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Address 1</td>
                                <td>
                                    <input
                                        required
                                        name="address1"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter your address"
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Adress 2</td>
                                <td>
                                    <input
                                        name="address2"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter your address"
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Zip code</td>
                                <td>
                                    <input
                                        required
                                        name="zipCode"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter the zip code"
                                        id="z1"
                                    />
                                </td>
                                <td>City</td>
                                <td>
                                    <input
                                        required
                                        name="city"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter the name of city"
                                        id="p2"
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Country</td>
                                <td>
                                    <input
                                        required
                                        name="country"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter the name of your country"
                                        id="c1"
                                    />
                                </td>
                                <td>Region</td>
                                <td>
                                    <input
                                        required
                                        name="region"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter the name of region"
                                        id="r1"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <br />

                <div className="check">
                    <label htmlFor="checkbox">
                        {" "}
                        <b>
                            My Billing address is as same as my Shipping Address
                        </b>{" "}
                    </label>
                    <input
                        type="checkbox"
                        name="check"
                        value="false"
                        onChange={() => setCheck(!check)}
                    />
                </div>

                <br />

                <div className="billingAddress">
                    {!check && (
                        <table cellSpacing="2" align="center" cellPadding="8">
                            <thead>
                                <tr>
                                    <td>
                                        <h2>Billing Address</h2>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td> Firstname</td>
                                    <td>
                                        <input
                                            required
                                            autoFocus
                                            name="billingfirstName"
                                            onChange={onChangeBilling}
                                            type="text"
                                            placeholder="Enter your firstname"
                                            id="fn1"
                                        />
                                    </td>
                                    <td> Lastname</td>
                                    <td>
                                        <input
                                            required
                                            name="billinglastName"
                                            onChange={onChangeBilling}
                                            type="text"
                                            placeholder="Enter your lastname"
                                            id="ln1"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Email </td>
                                    <td>
                                        <input
                                            required
                                            name="billingemail"
                                            onChange={onChangeBilling}
                                            type="email"
                                            placeholder="Enter your email"
                                            id="e1"
                                        />
                                    </td>
                                    <td>Mobile nr </td>
                                    <td>
                                        <input
                                            required
                                            name="billingmobileNr"
                                            onChange={onChangeBilling}
                                            type="tel"
                                            placeholder="Enter your telephone"
                                            id="m1"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Company name</td>
                                    <td>
                                        <input
                                            required
                                            name="billingcompany"
                                            onChange={onChangeBilling}
                                            type="text"
                                            placeholder="Enter the name of your company"
                                        />
                                    </td>

                                    <td>Company VAT number</td>
                                    <td>
                                        <input
                                            required
                                            name="billingvatNr"
                                            onChange={onChangeBilling}
                                            type="number"
                                            placeholder="Enter your company VAT number"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Address 1</td>
                                    <td>
                                        <input
                                            required
                                            name="billingaddress1"
                                            onChange={onChangeBilling}
                                            type="text"
                                            placeholder="Enter your address"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Adress 2</td>
                                    <td>
                                        <input
                                            name="billingaddress2"
                                            onChange={onChangeBilling}
                                            type="text"
                                            placeholder="Enter your address"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Zip code</td>
                                    <td>
                                        <input
                                            required
                                            name="billingzipCode"
                                            onChange={onChangeBilling}
                                            type="number"
                                            placeholder="Enter the zipe code"
                                            id="z1"
                                        />
                                    </td>
                                    <td>City</td>
                                    <td>
                                        <input
                                            required
                                            name="billingcity"
                                            onChange={onChangeBilling}
                                            type="text"
                                            placeholder="Enter the name of city"
                                            id="p2"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Country</td>
                                    <td>
                                        <input
                                            required
                                            name="billingcountry"
                                            onChange={onChangeBilling}
                                            type="text"
                                            placeholder="Enter the name of your country"
                                            id="c1"
                                        />
                                    </td>
                                    <td>Region</td>
                                    <td>
                                        <input
                                            required
                                            name="billingregion"
                                            onChange={onChangeBilling}
                                            type="text"
                                            placeholder="Enter the name of region"
                                            id="r1"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>

                <br />
                <button className="link-style" type="submit">
                    Gå til betaling
                </button>
            </form>
        </div>
    );
};

export default Delivery;
