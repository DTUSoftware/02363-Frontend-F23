import { Address } from "../interfaces/Address";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Delivery.css";
import { City } from "../interfaces/City";

const Delivery = () => {

    const [data, setData]= useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( ()=>{
        fetch("https://api.dataforsyningen.dk/postnumre")
        .then( response =>{
            if(response.ok){
                return response.json()
            }
            throw Error("It is not possible to fetch the data from the API")
        })
        .then( data =>{
            setIsLoading(false)
            setData(data)
            setError(null)
        })
        .catch(er => {
            setIsLoading(false)
            setError(er)
        })

    })

    const [cityList, setCity]= useState<City[]>([]);
    let tempList: City[]=[]
    function filterList(){
        data.map(old => {
            if(!tempList.find(n => n.navn == old.navn)){
                tempList.push(old)                
            }
        })

        setCity(tempList);
    }

    useEffect(()=>{
        filterList();
    })

    const [check, setCheck] = useState(false);

    const navigate = useNavigate();

    const [billingAddress, setBilling] = useState<Address>({
        firstName: "",
        lastName: "",
        email: "",
        mobileNr: 0,
        company: "",
        vatNr: 0,
        country: "",
        zipCode: "select",
        city: "select",
        address1: "",
        address2: "",
    });

    const [shippingAddress, setShipping] = useState<Address>({
        firstName: "",
        lastName: "",
        email: "",
        mobileNr: 0,
        company: "",
        vatNr: 0,
        country: "",        
        zipCode: "select",
        city: "select",
        address1: "",
        address2: "",
    });

    const onChangeBillingSelect = (event: React.ChangeEvent<HTMLSelectElement>): void =>{
        setBilling({
            ...billingAddress,
            [event.target.name]: event.target.value
        })
    }  

    const onChangeShippingSelect = (event: React.ChangeEvent<HTMLSelectElement>): void =>{
        setShipping({
            ...shippingAddress,
            [event.target.name]: event.target.value
        })
    }  

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
    }

    return (
        <div className="delivery">
            <form className="form" onSubmit={handleSubmit}>

                <div className="billingAddress">
                    <table cellSpacing="2" align="center" cellPadding="8">
                            <thead>
                                <tr>
                                    <td>
                                        <h2>Faktureringsadresse</h2>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td> Fornavn</td>
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
                                    <td> Efternavn</td>
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
                                    <td>Mobilnummer (valgfrit)</td>
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
                                    <td>Evt. firmanavn (valgfrit)</td>
                                    <td>
                                        <input
                                            required
                                            name="billingcompany"
                                            onChange={onChangeBilling}
                                            type="text"
                                            placeholder="Enter the name of your company"
                                        />
                                    </td>

                                    <td>Virksomhed VAT-nummer</td>
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
                                    <td>Adresselinje 1</td>
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
                                    <td>Adresselinje 2</td>
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
                                    <td>Postnummer</td>
                                    
                                    <td>
                                        <select name="zipCode" id="z1" value={billingAddress.zipCode} onChange={e=>onChangeBillingSelect(e)}>
                                            {
                                                data.map(city => 
                                                    <option key={city.nr} value={city.nr} >
                                                        {city.nr}
                                                    </option>
                                                )
                                            }
                                        </select>                                        
                                    </td>
                                    <td>By</td>
                                    <td>
                                        <select name="city" id="c1" value={billingAddress.city} onChange={onChangeBillingSelect}>
                                            {
                                                cityList.map(city=>
                                                    <option key={city.nr} value={city.navn}>
                                                        {city.navn}
                                                    </option>
                                                )
                                            }
                                        </select>
                                    </td>
                                </tr>

                                <tr>
                                    <td>Land</td>
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

                <div className="shippingAddress">
                    {!check && (
                        <table cellSpacing="2" align="center" cellPadding="8">
                        <thead>
                            <tr>
                                <td>
                                    <h2>Leveringsadresse</h2>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> Fornavn</td>
                                <td>
                                    <input
                                        required
                                        autoFocus
                                        name="firstName"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter your firstname"
                                        id="fn2"
                                    />
                                </td>
                                <td> Efternavn</td>
                                <td>
                                    <input
                                        required
                                        name="lastName"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter your lastname"
                                        id="ln2"
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
                                        id="e2"
                                    />
                                </td>
                                <td>Mobilnummer (valgfrit)</td>
                                <td>
                                    <input
                                        required
                                        name="mobileNr"
                                        onChange={onChangeShipping}
                                        type="tel"
                                        placeholder="Enter your telephone"
                                        id="m2"
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Evt. firmanavn (valgfrit)</td>
                                <td>
                                    <input
                                        required
                                        name="company"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter the name of your company"
                                    />
                                </td>

                                <td>Virksomhed VAT-nummer</td>
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
                                <td>Adresselinje 1</td>
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
                                <td>Adresselinje 2</td>
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
                                <td>Postnummer</td>
                                <td>
                                    <select name="zipCode" id="z2" value={shippingAddress.zipCode} onChange={onChangeShippingSelect}>
                                        {
                                            data.map(city=> 
                                                <option key={city.nr} value={city.navn}>
                                                    {city.nr}
                                                </option>
                                            )
                                        }
                                    </select>
                                </td>
                                <td>By</td>
                                <td>
                                    <select name="city" id="c2" value={shippingAddress.city} onChange={onChangeShippingSelect}>
                                        {
                                            cityList.map(city=>
                                                <option key={city.nr} value={city.navn}>
                                                    {city.navn}
                                                </option>
                                            )
                                        }
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td>Land</td>
                                <td>
                                    <input
                                        required
                                        name="country"
                                        onChange={onChangeShipping}
                                        type="text"
                                        placeholder="Enter the name of your country"
                                        id="c2"
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
