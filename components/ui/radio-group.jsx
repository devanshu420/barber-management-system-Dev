// components/ui/radio-group.jsx

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

export function RadioGroup({ value, onValueChange, children, ...props }) {
  return (
    <RadioGroupPrimitive.Root value={value} onValueChange={onValueChange} {...props}>
      {children}
    </RadioGroupPrimitive.Root>
  );
}

export function RadioGroupItem({ value, id, ...props }) {
  return (
    <RadioGroupPrimitive.Item value={value} id={id} {...props}>
      <span className="inline-block w-4 h-4 rounded-full border border-gray-400 mr-2 bg-white" />
    </RadioGroupPrimitive.Item>
  );
}
