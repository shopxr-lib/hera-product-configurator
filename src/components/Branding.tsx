import { Text, Anchor } from "@mantine/core";
import Logo from "../assets/images/ShopXRLogo.png";

const brandLink = "https://shopxr.org";

const Branding = () => {
  return (
    <div className="fixed bottom-0 w-full flex justify-center items-center py-3">
      <Text size="xs">Powered by</Text>
      <Anchor href={brandLink} target="_blank">
        <img alt="Powered by ShopXR" src={Logo} className="h-4" />
      </Anchor>
    </div>
  );
};

export default Branding;
