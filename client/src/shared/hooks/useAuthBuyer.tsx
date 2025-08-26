
import { useAppSelector } from "./useAppSelector";
import type { BuyerType } from "@/entities/buyer";

// Хук для проверки авторизации
export const useAuthBuyer = (): { buyer: BuyerType | null; isAuthenticatedBuyer: boolean;  } => {
    const { buyer } = useAppSelector((store) => store.buyer);
    const isAuthenticatedBuyer = !!buyer;
    return { buyer, isAuthenticatedBuyer };
};  