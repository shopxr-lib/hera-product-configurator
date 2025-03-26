import { IconCalendar, IconMail, IconPhone } from "@tabler/icons-react";
import { CustomTable } from "../../components";
import { Column } from "../../components/CustomTable/types";
import { ITracking } from "./types";
import { BuyingPhase } from "../../types";
import { useState } from "react";

export const LeadTracker = () => {
  const [data, setData] = useState<ITracking[]>([
    {
      id: '1',
      name: 'Athena Weissnat',
      email: 'Elouise.Prohaska@yahoo.com',
      phoneNumber: '1-800-123-4567',
      links: [
        { link: 'https://github.com/shopxr-lib/hera-product-configurator', lastSavedDate: '2024-04-05' },
        { link: 'https://www.example.com', lastSavedDate: '2024-05-10' }
      ],
      customerBuyingPhase: "Haven't collected Keys",
      keyCollectionDate: '2024-04-05',
      interestedProducts: undefined,
      followedUpDate1: '2024-04-05',
      followedUpDate2: null,
      followedUpDate3: null,
      visitedShowroom: 'Yes',
      purchased: 'No',
      salesPerson: 'John Doe',
      notes: undefined
    },
    {
      id: '2',
      name: 'Deangelo Runolfsson',
      email: 'Kadin_Trantow87@yahoo.com',
      phoneNumber: '1-800-123-4567',
      links: [
        { link: 'https://github.com/shopxr-lib/hera-product-configurator', lastSavedDate: '2024-04-05'}
      ],
      customerBuyingPhase: "Haven't collected Keys",
      keyCollectionDate: '2024-04-05',
      interestedProducts: undefined,
      followedUpDate1: '2024-04-05',
      followedUpDate2: null,
      followedUpDate3: null,
      visitedShowroom: 'Yes',
      purchased: 'No',
      salesPerson: 'John Doe',
      notes: undefined
    },
    {
      id: '3',
      name: 'Danny Carter',
      email: 'Marina3@hotmail.com',
      phoneNumber: '1-800-123-4567',
      links: [
        { link: 'https://github.com/shopxr-lib/hera-product-configurator', lastSavedDate: '2024-04-05'}
      ],
      customerBuyingPhase: "Haven't collected Keys",
      keyCollectionDate: null,
      interestedProducts: undefined,
      followedUpDate1: '2024-04-05',
      followedUpDate2: null,
      followedUpDate3: null,
      visitedShowroom: 'Yes',
      purchased: 'No',
      salesPerson: 'John Doe',
      notes: undefined
    },
    {
      id: '4',
      name: 'Trace Tremblay PhD',
      email: 'Antonina.Pouros@yahoo.com',
      phoneNumber: '1-800-123-4567',
      links: [
        { link: 'https://github.com/shopxr-lib/hera-product-configurator', lastSavedDate: '2024-04-05'}
      ],
      customerBuyingPhase: "Haven't collected Keys",
      keyCollectionDate: null,
      interestedProducts: undefined,
      followedUpDate1: '2024-04-05',
      followedUpDate2: null,
      followedUpDate3: null,
      visitedShowroom: 'Yes',
      purchased: 'No',
      salesPerson: undefined,
      notes: undefined
    },
    {
      id: '5',
      name: 'Derek Dibbert',
      email: 'Abagail29@hotmail.com',
      phoneNumber: '1-800-123-4567',
      links: [
        { link: 'https://google.com', lastSavedDate: '2024-04-05'}
      ],
      customerBuyingPhase: "Haven't collected Keys",
      keyCollectionDate: '2024-04-05',
      interestedProducts: undefined,
      followedUpDate1: '2024-04-05',
      followedUpDate2: null,
      followedUpDate3: null,
      visitedShowroom: 'Yes',
      purchased: 'No',
      salesPerson: undefined,
      notes: 'This is a note'
    },
    {
      id: '6',
      name: 'Viola Bernhard',
      email: 'Jamie23@hotmail.com',
      phoneNumber: '1-800-123-4567',
      links: [
        { link: 'https://google.com', lastSavedDate: '2024-04-05'}
      ],
      customerBuyingPhase: "Haven't collected Keys",
      keyCollectionDate: '2024-04-05',
      interestedProducts: undefined,
      followedUpDate1: '2024-04-05',
      followedUpDate2: null,
      followedUpDate3: null,
      visitedShowroom: 'Yes',
      purchased: 'No',
      salesPerson: 'John Doe',
      notes: 'This is a note',
    },
    {
      id: '7',
      name: 'Austin Jacobi',
      email: 'Genesis42@yahoo.com',
      phoneNumber: '1-800-123-4567',
      links: [
        { link: 'https://google.com', lastSavedDate: '2024-04-05'}
      ],
      customerBuyingPhase: "Haven't collected Keys",
      keyCollectionDate: '2024-04-05',
      interestedProducts: undefined,
      followedUpDate1: '2024-04-05',
      followedUpDate2: null,
      followedUpDate3: null,
      visitedShowroom: 'Yes',
      purchased: 'No',
      salesPerson: 'John Doe',
      notes: 'This is a note'
    },
    {
      id: '8',
      name: 'Hershel Mosciski',
      email: 'Idella.Stehr28@yahoo.com',
      phoneNumber: '1-800-123-4567',
      links: [
        { link: 'https://google.com', lastSavedDate: '2024-04-05'}
      ],
      customerBuyingPhase: "Haven't collected Keys",
      keyCollectionDate: null,
      interestedProducts: undefined,
      followedUpDate1: '2024-04-05',
      followedUpDate2: null,
      followedUpDate3: null,
      visitedShowroom: 'Yes',
      purchased: 'No',
      salesPerson: 'John Doe',
      notes: undefined
    },
    {
      id: '9',
      name: 'Mylene Ebert',
      email: 'Hildegard17@hotmail.com',
      phoneNumber: '1-800-123-4567',
      links: [
        { link: 'https://google.com', lastSavedDate: '2024-04-05'}
      ],
      customerBuyingPhase: "Haven't collected Keys",
      keyCollectionDate: '2024-04-05',
      interestedProducts: undefined,
      followedUpDate1: '2024-04-05',
      followedUpDate2: null,
      followedUpDate3: null,
      visitedShowroom: 'Yes',
      purchased: 'No',
      salesPerson: undefined,
      notes: undefined
    }
  ]);

  const columns: Column<ITracking>[] = [
    { 
      key: 'name', 
      label: 'Name',
      type: 'user',
      sort: true
    },
    { 
      key: 'phoneNumber', 
      label: 'Phone Number', 
      icon: <IconPhone/>,
    },
    { 
      key: 'email', 
      label: 'Email', 
      icon: <IconMail/>,
      sort: true
    },
    { 
      key: 'links', 
      label: 'Link to Saved Design', 
      type: 'multiline',
      data: [
        {
          key: 'link',
          type: 'link',
        },
        {
          key: 'lastSavedDate',
          icon: <IconCalendar/>
        }
      ]
    },
    { 
      key: 'customerBuyingPhase', 
      label: 'Customer Buying Phase', 
      type: 'select', 
      options: Object.values(BuyingPhase), 
      onChange: (id, value) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, customerBuyingPhase: value } : item
          )
        );
      }
    },
    { 
      key: 'keyCollectionDate', 
      label: 'Key Collection Date',
      type: 'date',
      onChange: (id, value) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, keyCollectionDate: value } : item
          )
        );
      }
    },
    { 
      key: 'interestedProducts', 
      label: 'List of Interested Products',
      type: 'textarea',
      onChange: (id, value) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, interestedProducts: value } : item
          )
        );
      } 
    },
    { 
      key: 'followedUpDate1', 
      label: 'Followed Up Date 1',
      sort: true,
      type: 'date',
      onChange: (id, value) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, followedUpDate1: value } : item
          )
        );
      }
    },
    { 
      key: 'followedUpDate2', 
      label: 'Followed Up Date 2',
      sort: true,
      type: 'date',
      onChange: (id, value) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, followedUpDate2: value } : item
          )
        );
      }
    },
    { 
      key: 'followedUpDate3', 
      label: 'Followed Up Date 3',
      sort: true,
      type: 'date',
      onChange: (id, value) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, followedUpDate3: value } : item
          )
        );
      }
    },
    {
      key: "visitedShowroom",
      label: "Visited Showroom?",
      type: "select",
      options: ["Yes", "No"],
      render: (value) => (value ? "Yes" : "No"),
      onChange: (id, value) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, visitedShowroom: value } : item
          )
        );
      },
    },
    {
      key: "purchased",
      label: "Purchased?",
      type: "select",
      options: ["Yes", "No"],
      render: (value) => (value ? "Yes" : "No"),
      onChange: (id, value) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, purchased: value } : item
          )
        );
      },
    },
    {
      key: "salesPerson",
      label: "Assigned Sales Person",
      sort: true,
      type: "select",
      options: ["None","John Doe", "Jane Doe"],
      onChange: (id, value) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, salesPerson: value } : item
          )
        );
      },
    },
    {
      key: 'notes',
      label: 'Notes',
      type: 'textarea',
      onChange: (id, value) => {    
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, notes: value } : item
          )
        );
      }
    }
  ];

  return <CustomTable data={data} columns={columns} />;
};
