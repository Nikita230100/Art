
import { useAppSelector } from "./useAppSelector";
import type { SellerType } from "@/entities/seller";

// Хук для проверки авторизации
export const useAuthSeller = (): { seller: SellerType | null; isAuthenticatedSeller: boolean;  } => {
    const { seller } = useAppSelector((store) => store.seller);
    const isAuthenticatedSeller = !!seller;
    return { seller, isAuthenticatedSeller };
};