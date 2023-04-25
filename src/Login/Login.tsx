import { useEffect, useState } from "react";
import { SdkResponse } from '@descope/node-sdk';
import Beatloader from "../SpinnerAnimation/BeatLoader";
import { DescopeSdkType } from "../interfaces/DescopeSdkType"
import "./Login.css"

type Options = {customClaims: Record<string, any>};
type EmailType = (loginId: string, uri: string, loginOptions: Options) => Promise<SdkResponse<{ok: boolean}>>
type TokenResponce = {ok: boolean, data: {sessionJwt: string, user: {email: string}}};

function Login({descopeSdk, user, setUser, descopeToken}: {descopeSdk: DescopeSdkType, user: string, setUser: (user: string) => void, descopeToken: string | null}) {
    console.log(descopeToken);
    const [awaiting, setAwaiting] = useState(false);
    const [error, setError] = useState("");

    async function authenticate(descopeSdk: DescopeSdkType, email: string) {
        const url = window.location.href;
        const signInOptions : Options = {customClaims: { email }};
        try {
            console.log(email);
            console.log(url);
            console.log(signInOptions);
            //const responce = await descopeSdk.magicLink.signUpOrIn.email(email, url);
            const responce = await (descopeSdk.magicLink.signUpOrIn.email as EmailType)(email, url, signInOptions);
        if (responce.ok) {
            setAwaiting(true);
            setError("");
        } else {
            setError("Der gik noget galt under dit login forsøg!");
        }
        } catch (error) {
            setError("Der var noget galt med den givne mail!");
        }
    }

    async function verifyToken(descopeSdk: DescopeSdkType, descopeToken: string) {
        const responce = await (descopeSdk.magicLink.verify(descopeToken)) as TokenResponce;
        if (responce.ok) {
            return responce.data.user.email;
        }
    }

    async function userLogin(descopeToken: string) {
        const email = await verifyToken(descopeSdk, descopeToken);
        if (email !== undefined) {
            setUser(email);
        }
    }

    async function userLogout() {
        if (descopeToken) {
            const responce = await descopeSdk.logout(descopeToken);
            if (responce.ok) {
                setError("");
                setUser("");
            } else {
                setError("Noget gik galt under dit forsøg på at logge ud!");
            }
        } else {
            setUser("");
        }
    }

    const handleSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const target = event.currentTarget.elements.namedItem('email-field') as HTMLInputElement
        const email = target.value;
        authenticate(descopeSdk, email);
    }

    useEffect(() => {
        if (descopeToken !== null) {
            userLogin(descopeToken);
        }
    },[descopeToken])

    return (
        <div>
            {!descopeToken && !awaiting ? (<h2>Login og få den fulde brugeroplevelse</h2>) : (<h2>Din account</h2>)}
            {!descopeToken && !awaiting && 
                <form onSubmit={handleSubmit} name="login-form" aria-label="Login form">
                    <label htmlFor="email-field">Din email</label>
                    <input name="email-field" id="email-field" type="email"/>
                    <button type="submit">Login</button>
                </form>
            }
            {!descopeToken && awaiting && <p>Klik på det link som du har fået tilsendt i din mail!</p>}
            {descopeToken && !user && <Beatloader/> }
            {descopeToken && user && 
                <div>
                    <p>Du er logget ind som <b>{user}</b></p>
                    <button onClick={userLogout}>Log ud</button>
                </div>
            }
            {error && <p>{error}</p>}
        </div>
    )
}

export default Login