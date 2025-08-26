import { SignUpForm } from "@/features";
import { useLayoutEffect } from "react";

export function SignUpPage(): React.JSX.Element {

    useLayoutEffect(() => {
        document.title = "Регистрация";
    }, []);

    return (
        <div>
            <SignUpForm />
        </div>
    )
}