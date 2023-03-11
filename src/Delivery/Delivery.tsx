import { Address } from "../interfaces/Address";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Delivery.css";
import { City } from "../interfaces/City";

const Delivery = () => {

    const navigate = useNavigate();

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

    },[]);

    const [cityList, setCity]= useState<City[]>([]);
    let tempList: City[]=[]
    function filterList(){
        data.map(old => {
            if(!tempList.find(n => n.navn == old.navn)){
                tempList.push(old)                
            }
        })

        setCity(tempList);
    };

    useEffect(()=>{
        filterList();
    },[data]);

    const [check, setCheck] = useState(false);

    const [billingAddress, setBilling] = useState<Address>({
        firstName: "",
        lastName: "",
        email: "",
        mobileNr: 0,
        company: "",
        vatNr: "",
        country: "Danmark",
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
        vatNr: "",
        country: "Danmark",        
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
    };  

    const onChangeShippingSelect = (event: React.ChangeEvent<HTMLSelectElement>): void =>{
        setShipping({
            ...shippingAddress,
            [event.target.name]: event.target.value
        })
    };  

    const onChangeBilling = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setBilling({
            ...billingAddress,
            [event.target.name]: event.target.value,
        });
    };

    const onChangeShipping = (event: React.ChangeEvent<HTMLInputElement>): void => {
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
    };

    return (
        <div className="delivery">
            <form className="form" onSubmit={handleSubmit}>

                <div className="billingAddress">
                    <h2>Faktureringsadresse</h2>
                    
                    <div>
                        <label htmlFor="Fornavn">Fornavn</label>
                        <input
                            required
                            autoFocus
                            type="text"
                            name="firstName"
                            onChange={onChangeBilling}                            
                        />                                            
                    </div>

                    <div>
                        <label htmlFor="Efternavn">Efternavn</label>
                        <input
                            required
                            type="text"
                            name="lastName"
                            onChange={onChangeBilling}                            
                        />                   
                    </div>

                    <div>
                        <label htmlFor="Email">Email</label>
                        <input
                            required
                            type="email"
                            name="email"
                            onChange={onChangeBilling}                            
                        />                                            
                    </div>

                    <div>
                        <label htmlFor="Mobilnummer">Mobilnummer</label>
                        <input
                            required
                            type="tel"
                            name="mobileNr"
                            onChange={onChangeBilling}                            
                        />                                            
                    </div>

                    <div>
                        <label htmlFor="Firmanavn">Evt. firmanavn</label>
                        <input
                            required
                            type="text"
                            name="company"
                            onChange={onChangeBilling}
                        />                                            
                    </div>

                    <div>
                        <label htmlFor="VAT-nummer">VirksomhedVAT-nummer</label>
                        <input
                            required
                            pattern="\d{8}|\d{8}"
                            type="text"
                            name="vatNr"
                            onChange={onChangeBilling}                            
                        />                      
                    </div>

                    <div className="address-row">
                        <label htmlFor="BillingAddress">Adresselinje 1</label>
                        <input
                            required
                            type="text"
                            name="address1"
                            onChange={onChangeBilling}
                        />                                            
                    </div>

                    <div className="address-row">
                        <label htmlFor="BillingAddress">Adresselinje 2</label>
                        <input
                            required
                            type="text"
                            name="address2"
                            onChange={onChangeBilling}
                        />                                            
                    </div>

                    <div>
                        <label htmlFor="Postnummer">Postnummer</label>
                        <select name="zipCode"
                                value={billingAddress.zipCode}
                                onChange={onChangeBillingSelect}>
                                {
                                    data.map(city => 
                                        <option key={city.nr} value={city.nr} >
                                            {city.nr}
                                        </option>
                                    )
                                }
                        </select> 
                    </div>

                    <div>
                        <label htmlFor="By">By</label>
                        <select name="city"
                                value={billingAddress.city}
                                onChange={onChangeBillingSelect}>
                                {
                                    cityList.map(city=>
                                        <option key={city.nr} value={city.navn}>
                                            {city.navn}
                                        </option>
                                    )
                                }
                        </select>
                    </div>

                    <div>
                        <label htmlFor="Land">Land</label>
                        <input
                            required
                            type="text"
                            name="country"
                            disabled
                            value={billingAddress.country}
                            onChange={onChangeBilling}                            
                        />                                            
                    </div> 
                    
                    <div>
                        <br /><br />
                        <input
                            type="checkbox"
                            name="check"
                            value="false"
                            onChange={() => setCheck(!check)}
                        />
                        <label htmlFor="checkbox" id='checkbox-label'>
                            Min leveringsadresse er den samme som min faktureringsadresse
                        </label>
                    </div>
                                
                </div>

                    

                {!check && (
                    <div className="shippingAddress">

                        <h2>Leveringsadresse</h2>

                        <div>
                            <label htmlFor="Fornavn">Fornavn</label>
                            <input
                                required
                                autoFocus
                                type="text"
                                name="firstName"
                                onChange={onChangeShipping}                            
                            />                                            
                        </div>

                        <div>
                            <label htmlFor="Efternavn">Efternavn</label>
                            <input
                                required
                                type="text"
                                name="lastName"
                                onChange={onChangeShipping}                            
                            />                   
                        </div>

                        <div>
                            <label htmlFor="Email">Email</label>
                            <input
                                required
                                type="email"
                                name="email"
                                onChange={onChangeShipping}                            
                            />                                            
                        </div>

                        <div>
                            <label htmlFor="Mobilnummer">Mobilnummer</label>
                            <input
                                required
                                type="tel"
                                name="mobileNr"
                                onChange={onChangeShipping}                            
                            />                                            
                        </div>

                        <div>
                            <label htmlFor="Firmanavn">Evt. firmanavn</label>
                            <input
                                required
                                type="text"
                                name="company"
                                onChange={onChangeShipping}
                            />                                            
                        </div>

                        <div>
                            <label htmlFor="VAT-nummer">VirksomhedVAT-nummer</label>
                            <input
                                required
                                type="text"
                                name="vatNr"
                                pattern="\d{8}|\d{8}" 
                                onChange={onChangeShipping}                            
                            />                      
                        </div>

                        <div className="address-row">
                            <label htmlFor="ShippingAddress">Adresselinje 1</label>
                            <input
                                required
                                type="text"
                                name="address1"
                                onChange={onChangeShipping}
                            />                                            
                        </div>

                        <div className="address-row">
                            <label htmlFor="ShippingAddress">Adresselinje 2</label>
                            <input
                                required
                                type="text"
                                name="address2"
                                onChange={onChangeShipping}
                            />                                            
                        </div>

                        <div>
                            <label htmlFor="Postnummer">Postnummer</label>
                            <select name="zipCode"
                                    value={billingAddress.zipCode}
                                    onChange={onChangeShippingSelect}>
                                    {
                                        data.map(city => 
                                            <option key={city.nr} value={city.nr} >
                                                {city.nr}
                                            </option>
                                        )
                                    }
                            </select> 
                        </div>

                        <div>
                            <label htmlFor="By">By</label>
                            <select name="city"
                                    value={billingAddress.city}
                                    onChange={onChangeShippingSelect}>
                                    {
                                        cityList.map(city=>
                                            <option key={city.nr} value={city.navn}>
                                                {city.navn}
                                            </option>
                                        )
                                    }
                            </select>
                        </div>

                        <div>
                            <label htmlFor="Land">Land</label>
                            <input
                                required
                                type="text"
                                name="country"
                                disabled
                                value={shippingAddress.country}
                                onChange={onChangeShipping}                            
                            />                                            
                        </div>                   
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

export default Delivery;
