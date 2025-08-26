import { SignInFormBuyer } from "@/features/ui/SignInFormBuyer/SignInFormBuyer";
import { SignInFormSeller } from "@/features/ui/SignInFormSeller/SignInFormSeller";
import { useLayoutEffect, useState } from "react";
import "./SignInPage.css";
export function SignInPage(): React.JSX.Element {
    const [isSeller, setIsSeller] = useState(false);
    useLayoutEffect(() => {
        document.title = "Вход";
    }, []);

    
    return (
        <div className="signin-container">
            <div className="form-wrapper">
                {isSeller ? <SignInFormSeller /> : <SignInFormBuyer />}
                <div className="role-select-container">
                    
                    <select
                        className="role-select"
                        value={isSeller ? 'seller' : 'buyer'}
                        onChange={(e) => setIsSeller(e.target.value === 'seller')}
                    >
                        <option value="buyer">Покупатель</option>
                        <option value="seller">Продавец</option>
                    </select>
                </div>
            </div>
        </div>
    );
}