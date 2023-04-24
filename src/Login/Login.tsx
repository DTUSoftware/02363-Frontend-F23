import { useEffect, useState } from "react";
import DescopeSdk from '@descope/web-js-sdk';
import { SdkResponse } from '@descope/node-sdk';
import Beatloader from "../SpinnerAnimation/BeatLoader";
import "./Login.css"

type DescopeSdkType = ReturnType<typeof DescopeSdk>;
type Options = {customClaims: Record<string, any>};
type EmailType = (loginId: string, uri: string, loginOptions: Options) => Promise<SdkResponse<{ok: boolean}>>
type TokenResponce = {ok: boolean, data: {user: {email: string}}};

function Login({descopeSdk, user, setUser, descopeToken}: {descopeSdk: DescopeSdkType, user: string, setUser: (user: string) => void, descopeToken: string | null}) {
    const [awaiting, setAwaiting] = useState(false);
    const [error, setError] = useState("");

    async function authenticate(descopeSdk: DescopeSdkType, email: string) {
        const url = window.location.href;
        const signInOptions : Options = {customClaims: { email }};
        try {
        const responce = await (descopeSdk.magicLink.signIn.email as EmailType)(email, url, signInOptions);
        if (responce.ok) {
            setAwaiting(false);
            setError("");
        } else {
            setAwaiting(false);
            setError("Der gik noget galt under dit login forsøg!");
        }
        } catch (error) {
            console.log("Here");
            setAwaiting(false);
            setError("Der var noget galt med den givne mail!");
        }
    }

    async function verifyToken(descopeSdk: DescopeSdkType, descopeToken: string) {
        const responce = await (descopeSdk.magicLink.verify(descopeToken)) as TokenResponce;
        if (responce.ok) {
            return responce.data.user.email;
        } else {
            setAwaiting(false);
            setError("Noget gik galt under verificeringen af din adgang!");
        }
    }

    async function userLogin(descopeToken: string) {
        const email = await verifyToken(descopeSdk, descopeToken);
        if (email !== undefined) {
            setUser(email);
        }
    }

    async function userLogout() {
        setAwaiting(true);
        const responce = await descopeSdk.logout();
        if (responce.ok) {
            setUser("");
        } else {
            setAwaiting(false);
            setError("Noget gik galt under dit forsøg på at logge ud!");
        }
    }

    const handleSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        setAwaiting(true);
        const target = event.currentTarget.elements.namedItem('email-field') as HTMLInputElement
        const email = target.value;
        authenticate(descopeSdk, email);
    }

    useEffect(() => {
        if (descopeToken !== null) {
            setAwaiting(true);
            userLogin(descopeToken);
            setAwaiting(false);
            setUser("");
        }
    },[descopeToken])

    return (
        <div>
            <h2>Login og få den fulde brugeroplevelse</h2>
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