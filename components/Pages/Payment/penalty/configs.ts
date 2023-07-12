import UserAssociation from "@services/models/associations/userAssociations"
import fieldNames from "@components/ui/Form/__form.utils"

import { penaltiesPaymentTableData } from "./methods"

export const createData: CreateData = {
  buttonTitle: "newPenaltyPayment",
  formTitle: "createPenaltyPayment",
  formIcon: "plus-box-outline",
  model: new UserAssociation(),
  validation: {},
  fields: [
    {
      name: fieldNames.selectField,
      placeholder: "pages.selectCurrency",
      searchPlaceholder: "pages.search",
      icon: "cash",
      options: [
        { label: "Item 1", value: "hello" },
        { label: "Item 2", value: "hello2" },
        { label: "Item 3", value: "hello3" },
        { label: "Item 4", value: "hello4" },
        { label: "Item 5", value: "hello5" },
        { label: "Item 6", value: "hello6" },
        { label: "Item 7", value: "hello7" },
        { label: "Item 8", value: "hello8" }
      ]
    }
  ]
}

const tableHead = [
  "creationDate",
  "name",
  "designation",
  "amount",
  "majoration",
  "comments",
  "status",
  "dueDate"
]

const widthArr = Array(tableHead.length).fill(150)

export const penaltiesPaymentTable = {
  widthArr,
  tableHead,
  tableData: penaltiesPaymentTableData
}
