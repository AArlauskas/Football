import MaterialTable from "material-table";
import React from "react";
import { teams } from "../../constants/teams";

const columns = [
  {
    title: "Date",
    field: "date",
    type: "date",
    dateSetting: { locale: "lt-LT" },
    align: "left",
  },
  {
    title: "Time",
    field: "time",
    type: "time",
    dateSetting: { locale: "lt-LT" },
    align: "left",
  },
  { title: "Team 1", field: "team1", lookup: teams, align: "center" },
  { title: "Team 2", field: "team2", lookup: teams, align: "center" },
  { title: "Score 1", field: "score1", type: "numeric", align: "center" },
  { title: "Score 2", field: "score2", type: "numeric", align: "center" },
  { title: "Started", field: "started", type: "boolean", align: "center" },
];

export default function AdminTable({ data, onAdd }) {
  const validateEntry = (newData) => {
    if (newData.score1 < 0 || newData.score1 > 9) return false;
    if (newData.score2 < 0 || newData.score2 > 9) return false;
    return true;
  };

  return (
    <MaterialTable
      title=""
      columns={columns}
      data={data}
      options={{
        filtering: true,
        pageSize: 10,
      }}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              if (validateEntry(newData)) {
                onAdd(newData);
                resolve();
              } else {
                reject();
              }
            }, 1000);
          }),
      }}
    />
  );
}
