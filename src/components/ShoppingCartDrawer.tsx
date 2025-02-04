import { Divider, Drawer, Title } from "@mantine/core";
import useStore from "../store/useStore";
import { startingPrices } from "./constants";

const ShoppingCartPopUp = () => {
  const opened = useStore((state) => state.modals.shoppingCart);
  const setModal = useStore((state) => state.setModal);
  const close = () => setModal("shoppingCart", false);
  const cartItems = useStore((state) => state.cartItems);

  const chosenPackage = useStore((state) => state.package);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price,
    startingPrices[chosenPackage],
  );

  return (
    <Drawer
      opened={opened}
      onClose={close}
      title={<p className="text-xl font-bold">Your Cart</p>}
      position="right"
      padding="xl"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Title order={5}>Items</Title>
            <Title order={5}>Price</Title>
          </div>
          <div className="flex justify-between">
            <p>
              Package: <span className="capitalize">{chosenPackage}</span>
            </p>
            <p>
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(startingPrices[chosenPackage])}
            </p>
          </div>
          {cartItems.map((item) => (
            <div key={item.key} className="flex justify-between">
              <p>{item.name}</p>
              <p>
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(item.price)}
              </p>
            </div>
          ))}
          <Divider />
          <div className="flex justify-between">
            <p className="font-bold">Total</p>
            <p className="font-bold">
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(total)}
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default ShoppingCartPopUp;
