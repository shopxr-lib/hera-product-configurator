import { IconShoppingCartFilled } from "@tabler/icons-react";
import useStore, { useTotalPrice } from "../store/useStore";

const ShoppingCartFloating = () => {
  const setModal = useStore((state) => state.setModal);
  const totalPrice = useTotalPrice();
  return (
    <button
      className="md-4 bg-brand-800 fixed top-4 right-4 z-20 flex items-center gap-2 rounded-full p-4"
      onClick={() => setModal("shoppingCart", true)}
    >
      <p className="text-white">
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(totalPrice)}
      </p>
      <IconShoppingCartFilled size={24} className="text-white" />
    </button>
  );
};

export default ShoppingCartFloating;
