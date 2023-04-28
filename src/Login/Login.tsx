import { useState } from "react";
import { SdkResponse } from "@descope/node-sdk";
import Beatloader from "../SpinnerAnimation/BeatLoader";
import { DescopeSdkType } from "../interfaces/DescopeSdkType";
import "./Login.css";
import { routes } from "../Navigation/RoutePaths";

/**
 * Options type for loginOptions with customClaims Records of string and any types
 * Used to hold custom token claims
 */
type Options = { customClaims: Record<string, any> };

/**
 * EmailType with loginId and uri of string type and loginOptions of Options type, returns a Promise with type SdkResponse
 * Used for type assertion to expand magicLink.signUpOrIn.email to allow for custom token claim options
 */
type EmailType = (
    loginId: string,
    uri: string,
    loginOptions: Options
) => Promise<SdkResponse<{ ok: boolean }>>;

/**
 * TokenResponce with ok of type boolean and data object type with sessionJwt string and user object type with email string
 * Used for type assertion to handle magicLink.verify responce and infer object type
 */
type TokenResponce = {
    ok: boolean;
    data: { sessionJwt: string; user: { email: string } };
};

/**
 * Login component page allowing the user to login using the descope magic link password-less login
 */
function Login({
    descopeSdk,
    user,
    descopeToken,
}: {
    descopeSdk: DescopeSdkType;
    user: string;
    descopeToken: string | null;
}) {
    // useState hooks for holding awaiting and error states
    const [awaiting, setAwaiting] = useState(false);
    const [error, setError] = useState("");

    // Function for authenticating the user using the magicLink signUpOrIn email option
    async function authenticate(descopeSdk: DescopeSdkType, email: string) {
        const url = window.location.href;
        const signInOptions: Options = { customClaims: { email } };
        try {
            const responce = await (
                descopeSdk.magicLink.signUpOrIn.email as EmailType
            )(email, url, signInOptions);
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

    // Function for logging out the user by reloading the page
    async function userLogout() {
        window.location.replace(routes.login.routePath);
    }

    // Function for handling the login form onSubmit
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.currentTarget.elements.namedItem(
            "email-field"
        ) as HTMLInputElement;
        const email = target.value;
        authenticate(descopeSdk, email);
    };

    return (
        <div className="login-box">
            <h2 className="login-header">
                {!descopeToken && !awaiting ? (
                    <>Log ind og få den fulde brugeroplevelse</>
                ) : (
                    <>Din bruger</>
                )}
            </h2>
            {!descopeToken && !awaiting && (
                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                    name="login-form"
                    aria-label="Login form"
                >
                    <div className="email-box">
                        <label htmlFor="email-field">
                            Indtast din email for at logge ind
                        </label>
                        <input className="email-field" name="email-field" id="email-field" type="email" />
                    </div>
                    <button type="submit">Log ind</button>
                </form>
            )}
            {!descopeToken && awaiting && (
                <p className="awaiting-text">Klik på det link som du har fået tilsendt i din mail!</p>
            )}
            {descopeToken && !user && <Beatloader />}
            {descopeToken && user && (
                <div>
                    <p className="loggedin-text">
                        Du er logget ind som <b>{user}</b>
                    </p>
                    <button onClick={userLogout}>Log ud</button>
                </div>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

/**
 * Function for verifying the descope token and returning user email from token claims
 */
async function verifyToken(descopeSdk: DescopeSdkType, descopeToken: string) {
    const responce = (await descopeSdk.magicLink.verify(
        descopeToken
    )) as TokenResponce;
    if (responce.ok) {
        return responce.data.user.email;
    }
}

/**
 * Function for logging in the user and setting setUser with the verified users email
 */
export async function userLogin(
    descopeSdk: DescopeSdkType,
    descopeToken: string,
    setUser: (user: string) => void
) {
    const email = await verifyToken(descopeSdk, descopeToken);
    if (email !== undefined) {
        setUser(email);
    }
}

export default Login;
