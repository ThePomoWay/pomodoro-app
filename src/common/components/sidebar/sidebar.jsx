import React from "react";
import { Drawer, List, ListItem, ListItemIcon } from "@mui/material";
import { Inbox, Report } from "@mui/icons-material";

export function Sidebar () {
    return (
        <Drawer variant="permanent">
        <List>
          <ListItem button>
            <ListItemIcon>
              <Inbox />
            </ListItemIcon>
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Report />
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>
    );
}