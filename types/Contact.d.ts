import { SelectItem } from "./formInputs";
export interface Contact {
    id: string;
    name: string;
    phone: string;
    email: string;
    type?: SelectItem[]
};