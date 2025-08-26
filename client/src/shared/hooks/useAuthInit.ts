import { useAppSelector } from "./useAppSelector";

export const useAuthInit = (): {
    isSellerInitialized: boolean | undefined;
    isBuyerInitialized: boolean | undefined;
    isAnyInitialized: boolean | undefined;
} => {
    const { isInitialized: isSellerInitialized } = useAppSelector(store => store.seller);
    const { isInitializedBuyer } = useAppSelector(store => store.buyer);
    
    return {
      isSellerInitialized,
      isBuyerInitialized: isInitializedBuyer,
      isAnyInitialized: isSellerInitialized || isInitializedBuyer
    };
  };