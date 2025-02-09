import { Divider, Drawer, Title } from "@mantine/core";
import useStore, { useCartItems, useTotalPrice } from "../store/useStore";

const ShoppingCartPopUp = () => {
  const opened = useStore((state) => state.modals.shoppingCart);
  const setModal = useStore((state) => state.setModal);
  const close = () => setModal("shoppingCart", false);

  const totalPrice = useTotalPrice();
  const cartItems = useCartItems();

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
          {cartItems.map((cartItem) => {
            return (
              <div key={cartItem.key} className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <p>{cartItem.name}</p>
                  <p>
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(cartItem.price)}
                  </p>
                </div>
                {cartItem.children?.map((child) => {
                  return (
                    <div
                      key={child.key}
                      className="ml-4 flex justify-between text-sm text-gray-800"
                    >
                      <p>{child.name}</p>
                      {child.price > 0 && (
                        <p>
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(child.price)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
          <Divider />
          <div className="flex justify-between">
            <p className="font-bold">Total</p>
            <p className="font-bold">
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(totalPrice)}
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default ShoppingCartPopUp;
