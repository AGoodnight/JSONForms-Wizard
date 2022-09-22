import { Controller, useForm } from "react-hook-form";
import UKButton from "shared/ukLibrary/ukButton";
import UKTextArea from "shared/ukLibrary/ukTextArea";
import UKTextField from "shared/ukLibrary/ukTextField";

export type ContactDetailValues = {
  address?: string;
  name?: string;
  phone?: string;
  comments?: string;
};

export type ContactDetailsProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  answers: ContactDetailValues;
  onChange?: (change: { [key: string]: any }) => void;
};

const ContactDetails = ({ answers, onChange }: ContactDetailsProps) => {
  const { control } = useForm();
  return (
    <form className="uk-margin">
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <UKTextField label="Your Address" {...field}></UKTextField>
        )}
      ></Controller>
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <UKTextField label="Phone Number" {...field}></UKTextField>
        )}
      />
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <UKTextField label="Your name ( optional )" {...field}></UKTextField>
        )}
      />
      <Controller
        name="comments"
        control={control}
        render={({ field }) => (
          <UKTextArea label="Other Details" {...field}></UKTextArea>
        )}
      />
      <UKButton type="button">Submit</UKButton>
    </form>
  );
};

export default ContactDetails;
