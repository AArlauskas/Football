import React, { useState, useRef } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@material-ui/core";
import { Assignment, Gavel, Poll, SportsSoccer } from "@material-ui/icons";
import { useHistory } from "react-router";

export default function NavDrawer({ open, onOpen, onClose }) {
  const history = useHistory();
  const tabs = useRef(
    new Map([
      ["Varžybos", { icon: <SportsSoccer />, href: "/home" }],
      ["Spėjimai", { icon: <Assignment />, href: "/personal" }],
      ["Rezultatai", { icon: <Poll />, href: "/results" }],
      ["Taisyklės", { icon: <Gavel />, href: "/rules" }],
    ])
  );

  const getSelectedTabKey = () => {
    let selected = null;
    tabs.current.forEach((value, key) => {
      if (window.location.href.includes(value.href)) {
        selected = key;
      }
    });
    return selected;
  };

  const [selectedTabKey, setSelectedTabKey] = useState(getSelectedTabKey());

  const handleTabClick = (key) => () => {
    setSelectedTabKey(key);
    const { href } = tabs.current.get(key);
    history.push(href);
  };

  const renderTabListItems = () => {
    const listItems = [];
    tabs.current.forEach((value, key) => {
      listItems.push(
        <ListItem
          button
          key={key.toString()}
          onClick={handleTabClick(key)}
          selected={selectedTabKey === key}
        >
          <ListItemIcon>{value.icon}</ListItemIcon>
          <ListItemText primary={key} />
        </ListItem>
      );
    });

    return listItems;
  };

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
    >
      <List style={{ width: "40vh" }}>{renderTabListItems()}</List>
    </SwipeableDrawer>
  );
}
