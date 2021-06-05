import { Flag, NotListedLocation, Lock } from "@material-ui/icons";
import MaterialTable from "material-table";
import React from "react";

const stateLookup = {
  open: "open",
  closed: "closed",
  finished: "finished",
};

export default function AdminTable({ teams, data, onAdd }) {
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
    {
      title: "Team 1",
      field: "team1",
      lookup: teams,
      align: "center",
      render: (rowData) => rowData.team1.name,
    },
    {
      title: "Team 2",
      field: "team2",
      lookup: teams,
      align: "center",
      render: (rowData) => rowData.team2.name,
    },
    {
      title: "Goals 1",
      field: "goals1",
      type: "numeric",
      align: "center",
      editable: "onUpdate",
      render: (rowData) => rowData.result && rowData.result.goals1,
    },
    {
      title: "Goals 2",
      field: "goals2",
      type: "numeric",
      align: "center",
      editable: "onUpdate",
      render: (rowData) => rowData.result && rowData.result.goals2,
    },
    {
      title: "State",
      field: "state",
      lookup: stateLookup,
      editable: "onUpdate",
      render: (rowData) => {
        const { state } = rowData;
        if (state === "Open") return <NotListedLocation />;
        if (state === "Closed") return <Lock />;
        if (state === "Finished") return <Flag />;
        return null;
      },
    },
  ];

  return (
    <MaterialTable
      title=""
      columns={columns}
      data={data}
      options={{
        filtering: true,
        pageSize: 10,
        actionsColumnIndex: -1,
      }}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              onAdd(newData);
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              onAdd(newData);
              resolve();
            }, 1000);
          }),
        onRowDelete: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              onAdd(newData);
              resolve();
            }, 1000);
          }),
      }}
    />
  );
}
