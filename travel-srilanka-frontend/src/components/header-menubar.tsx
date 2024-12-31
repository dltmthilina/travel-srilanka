"use client";

import { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Menu, Button } from "antd";
import Link from "next/link";
import classes from "./header-menubar.module.css";


export const HeaderMenuBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Menu items
  const items = [
    { key: "1", label: <Link href="/">Home</Link> },
    { key: "2", label: <Link href="/places">Places</Link> },
    { key: "3", label: <Link href="/guides">Guides</Link> },
    { key: "4", label: <Link href="/dining">Dining</Link> },
  ];

  return (
    <div className={classes["menu-container"]}>
      <Link href="/" className={classes["logo"]}>
        <h2>Ceylon </h2>
        <h2>TravelLife</h2>
      </Link>
      <Button
        className={classes["menu-btn"]}
        type="text"
        icon={<MenuOutlined />}
        onClick={toggleMenu}
      />
      <Drawer
        rootClassName="drawerCustom"
        title="Menu"
        placement="right"
        onClose={closeMenu}
        open={menuOpen}
      >
        <Menu mode="vertical" items={items} onClick={closeMenu} />
      </Drawer>
      <Menu
        mode="horizontal"
        items={items}
        className={classes["desktop-menu"]}
      />
    </div>
  );
};
