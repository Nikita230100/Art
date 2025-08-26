import { useAppSelector } from "@/shared/hooks/useAppSelector";
import "./BuyerInfo.css";

export default function BuyerInfo(): React.JSX.Element {
  const { buyer } = useAppSelector((state) => state.buyer);

  return (
    <div className="buyer-info">
      <div className="buyer-info__avatar-container">
        <img
          className="buyer-info__avatar"
          src={
            buyer?.avatar
              ? `${import.meta.env.VITE_API.replace("/api", "")}${
                  buyer.avatar
                }?v=${Date.now()}`
              : "../../../public/avatar.png"
          }
          alt="Аватар"
        />
      </div>
      <h1>{buyer?.username}</h1>
      <p>{buyer?.email}</p>
      <p>{buyer?.phone}</p>
    </div>
  );
}
