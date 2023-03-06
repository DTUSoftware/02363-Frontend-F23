import {Address} from "./models/Address"
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Delivery.css"

const Delivery = () => {

    const [check, setCheck]= useState(false)

    const[shippingAddress, setShipping]= useState<Address>({
        firstName: '',
        lastName: '',
        email: '',
        mobileNr: 0,
        company: '',
        vatNr: 0,
        country: '',
        region: '',
        zipCode: 0,
        city: '',
        address1: '',
        address2: '',
    })

    const[billingAddress, setBilling]= useState<Address>({
        firstName: '',
        lastName: '',
        email: '',
        mobileNr: 0,
        company: '',
        vatNr: 0,
        country: '',
        region: '',
        zipCode: 0,
        city: '',
        address1: '',
        address2: '',
    })
    

    const onChangeBilling = (event: React.ChangeEvent<HTMLInputElement>): void =>{
        setBilling({...billingAddress, [event.target.name]: event.target.value})
    };

    const onChangeShipping = (event: React.ChangeEvent<HTMLInputElement>): void =>{
        setShipping({...shippingAddress, [event.target.name]: event.target.value})
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        await saveToDB();
    }

   async function saveToDB(){

   }

    
    if(check){
        billingAddress.firstName= shippingAddress.firstName
        billingAddress.lastName= shippingAddress.lastName
        billingAddress.email= shippingAddress.email
        billingAddress.mobileNr= shippingAddress.mobileNr
        billingAddress.company = shippingAddress.company
        billingAddress.vatNr= shippingAddress.vatNr        
        billingAddress.address1= shippingAddress.address1
        billingAddress.address2= shippingAddress.address2
        billingAddress.zipCode= shippingAddress.zipCode
        billingAddress.city = shippingAddress.city
        billingAddress.country= shippingAddress.country
        billingAddress.region= shippingAddress.region     
    }
   

    return ( 
        <div className="delivery">
            <form className="form" onSubmit={onSubmit}>
                <div className="shippingAddress">
                    <table cellSpacing="2" align="center" cellPadding="8" >
                            <h2>Shipping Address</h2>
                            <tr>
                                <td> Firstname</td>   
                                <td><input name="firstName" onChange={onChangeShipping}  type="text" placeholder="Enter your firstname" id="fn1"/></td>
                                <td> Lastname</td>   
                                <td><input name="lastName" onChange={onChangeShipping}  type="text" placeholder="Enter your lastname" id="ln1"/></td>
                            </tr>
                            
                            <tr>
                                <td>Email </td>  
                                <td><input name="email" onChange={onChangeShipping}  type="email" placeholder="Enter your email" id="e1"/></td>
                                <td>Mobile nr </td>  
                                <td><input name="mobileNr" onChange={onChangeShipping}  type="mobileNr" placeholder="Enter your telephone" id="m1"/></td>
                            </tr>
                        
                            <tr>
                                <td>Company name</td>
                                <td><input name="company" onChange={onChangeShipping}  type="company" placeholder="Enter the name of your company"/></td>

                                <td>Company VAT number</td>
                                <td><input name="vatNr" onChange={onChangeShipping}  type="vatNr" placeholder="Enter your company VAT number"/></td>
                            </tr>

                            <tr>
                                <td>Address 1</td>
                                <td><input name="address1" onChange={onChangeShipping}  type="address1" placeholder="Enter your address"/></td>
                            </tr>

                            <tr>
                                <td>Adress 2</td>
                                <td><input name="address2" onChange={onChangeShipping}  type="address2" placeholder="Enter your address"/></td>
                            </tr>

                            <tr>  
                                <td>Zip code</td>  
                                <td><input name="zipCode" onChange={onChangeShipping}  type="number" placeholder="Enter the zip code" id="z1"/></td>         
                                <td>City</td>  
                                <td><input name="city" onChange={onChangeShipping}  type="city" placeholder="Enter the name of city" id="p2"/></td>
                            </tr> 

                            <tr>
                                <td>Country</td>  
                                <td><input name="country" onChange={onChangeShipping}  type="country" placeholder="Enter the name of your country" id="c1"/></td>
                                <td>Region</td>  
                                <td><input name="region" onChange={onChangeShipping}  type="region" placeholder="Enter the name of region" id="r1"/></td>
                            </tr> 

                    </table>    
                </div>
                
                <br />

                <div className="check">
                    <label htmlFor="checkbox"> <b>My Billing address is as same as my Shipping Address</b> </label>
                    <input type="checkbox" name= "check" value= "false" onChange={()=> setCheck(!check)}/>
                </div>

                <br />

                <div className="billingAddress">
                    
                    {!check && 
                        <table cellSpacing="2" align="center" cellPadding="8" >
                        <h2>Billing Address</h2>
                        <tr>
                            <td> Firstname</td>   
                            <td><input name="firstName" onChange={onChangeBilling}  type="text" placeholder="Enter your firstname" id="fn1"/></td>
                            <td> Lastname</td>   
                            <td><input name="lastName" onChange={onChangeBilling}  type="text" placeholder="Enter your lastname" id="ln1"/></td>
                        </tr>
                        
                        <tr>
                            <td>Email </td>  
                            <td><input name="email" onChange={onChangeBilling}  type="email" placeholder="Enter your email" id="e1"/></td>
                            <td>Mobile nr </td>  
                            <td><input name="mobileNr" onChange={onChangeBilling}  type="mobileNr" placeholder="Enter your telephone" id="m1"/></td>
                        </tr>
                    
                        <tr>
                            <td>Company name</td>
                            <td><input name="company" onChange={onChangeBilling}  type="company" placeholder="Enter the name of your company"/></td>

                            <td>Company VAT number</td>
                            <td><input name="vatNr" onChange={onChangeBilling}  type="vatNr" placeholder="Enter your company VAT number"/></td>
                        </tr>

                        <tr>
                            <td>Address 1</td>
                            <td><input name="address1" onChange={onChangeBilling}  type="address1" placeholder="Enter your address"/></td>
                        </tr>

                        <tr>
                            <td>Adress 2</td>
                            <td><input name="address2" onChange={onChangeBilling}  type="address2" placeholder="Enter your address"/></td>
                        </tr>

                        <tr>  
                            <td>Zip code</td>  
                            <td><input name="zipCode" onChange={onChangeBilling}  type="number" placeholder="Enter the zipe code" id="z1"/></td>         
                            <td>City</td>  
                            <td><input name="city" onChange={onChangeBilling}  type="city" placeholder="Enter the name of city" id="p2"/></td>
                        </tr> 

                        <tr>
                            <td>Country</td>  
                            <td><input name="country" onChange={onChangeBilling}  type="country" placeholder="Enter the name of your country" id="c1"/></td>
                            <td>Region</td>  
                            <td><input name="region" onChange={onChangeBilling}  type="region" placeholder="Enter the name of region" id="r1"/></td>
                        </tr> 

                    </table>           
                    }
                </div>
                
                <br />

                <Link className= "link-style" to="/payment" >  Go to payment  </Link> 
                
            </form>  
        </div>
    );
}
 
export default Delivery;