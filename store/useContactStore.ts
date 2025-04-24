import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Contact {
  id?: string;
  name: string;
  phoneNumber: string;
  email: string;
}

interface ContactsState {
  contacts: Contact[];
  name: string;
  addContact: (contact: Omit<Contact, "id">) => void;
  removeContact: (id: string) => void;
  setname: (name: string) => void;
  loadContacts: () => Promise<void>;
}

export const useContactsStore = create<ContactsState>()(
  persist(
    (set, get) => ({
      contacts: [],
      name: "",
      addContact: (contact) => {
        const newContact = {
          ...contact,
          id: Date.now().toString(),
        };
        set((state) => ({
          contacts: [...state.contacts, newContact],
        }));
      },
      removeContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        }));
      },
      setname: (name) => {
        set({ name: name });
      },
      loadContacts: async () => {
        // This is handled by the persist middleware
      },
    }),
    {
      name: "contacts-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
