import { useNavigate } from "react-router";

export function NotFound(): React.JSX.Element {
    const navigate = useNavigate();

    return (
        <div className="text-center">
            <h1 className="mt-5">404: Page not found</h1>
            <button type="button" className="btn btn-dark mt-5" onClick={() => navigate(-1)}>Go to back</button>
        </div>
    );
};
