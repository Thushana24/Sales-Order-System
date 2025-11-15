import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import type { Client } from "@/types";

interface CustomerSectionProps {
  clients: Client[];
  clientId: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
  onClientChange: (clientId: number) => void;
  onAddressChange: (field: string, value: string) => void;
}

const CustomerSection = ({
  clients,
  clientId,
  deliveryAddress,
  deliveryCity,
  deliveryPostalCode,
  deliveryCountry,
  onClientChange,
  onAddressChange,
}: CustomerSectionProps) => {
  return (
    <>
      <Card title="Customer Information">
        <Select
          label="Customer Name"
          value={clientId || ""}
          onChange={(e) => onClientChange(parseInt(e.target.value))}
          required
        >
          <option value="">Select Customer</option>
          {clients.map((client) => (
            <option key={client.clientId} value={client.clientId}>
              {client.clientName}
            </option>
          ))}
        </Select>
      </Card>

      <Card title="Delivery Address" className="mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Address"
              value={deliveryAddress}
              onChange={(e) =>
                onAddressChange("deliveryAddress", e.target.value)
              }
            />
          </div>
          <Input
            label="City"
            value={deliveryCity}
            onChange={(e) => onAddressChange("deliveryCity", e.target.value)}
          />
          <Input
            label="Postal Code"
            value={deliveryPostalCode}
            onChange={(e) =>
              onAddressChange("deliveryPostalCode", e.target.value)
            }
          />
          <div className="md:col-span-2">
            <Input
              label="Country"
              value={deliveryCountry}
              onChange={(e) =>
                onAddressChange("deliveryCountry", e.target.value)
              }
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default CustomerSection;
