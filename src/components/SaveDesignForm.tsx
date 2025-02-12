import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import PhoneInput from "./Input/PhoneInput";
import { isValidPhoneNumber } from "react-phone-number-input";

type Props = {
  onSubmit: (values: z.infer<typeof schema>) => void;
};

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine(isValidPhoneNumber, {
      message: "Invalid phone number",
    }),
});

const SaveDesignForm: React.FC<Props> = ({ onSubmit }) => {
  const form = useForm({
    initialValues: {
      name: "",
      phone: "",
      email: "",
    },
    validate: zodResolver(schema),
  });
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        return onSubmit(values);
      })}
      className="flex flex-col gap-4"
    >
      <TextInput
        label="Name"
        placeholder="Your name"
        required
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        label="Email"
        placeholder="your@email.com"
        required
        key={form.key("email")}
        {...form.getInputProps("email")}
      />
      <PhoneInput
        label="Phone Number"
        placeholder="Your Phone Number"
        required
        inputComponent={TextInput}
        inputKey={form.key("phone")}
        {...form.getInputProps("phone")}
      />

      <Button type="submit">Save Design</Button>
    </form>
  );
};

export default SaveDesignForm;
