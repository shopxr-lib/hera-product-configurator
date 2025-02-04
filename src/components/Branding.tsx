import { Text, Anchor } from "@mantine/core";
import Logo from "../assets/images/ShopXRLogo.png";

const brandLink = "https://shopxr.org";

const Branding = () => {
  return (
    <div className="fixed bottom-4 flex items-center">
      <Text size="xs">Powered by</Text>
      <Anchor href={brandLink} target="_blank">
        <img alt="Powered by ShopXR" src={Logo} className="h-4" />
      </Anchor>
    </div>
  );
};

export default Branding;
