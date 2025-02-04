import { Button, Modal, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { z } from "zod";
import useStore from "../store/useStore";
import { packageChoices } from "./constants";

const schema = z.object({
  package: z.string().min(1, { message: "Please select a package" }),
});

const PackagePopUp: React.FC = () => {
  const [opened, { close }] = useDisclosure(true);

  const setPackage = useStore((state) => state.setPackage);

  const form = useForm({
    initialValues: {
      package: "default",
    },
    validate: zodResolver(schema),
  });

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Choose your package"
      centered
      withCloseButton={false}
      closeOnClickOutside={false}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={form.onSubmit((values) => {
          setPackage(values.package);
          close();
        })}
      >
        <Select
          required
          allowDeselect={false}
          description="You can always change your package later"
          data={packageChoices}
          {...form.getInputProps("package")}
        />
        <Button type="submit">Save</Button>
      </form>
    </Modal>
  );
};

export default PackagePopUp;
