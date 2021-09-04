import React from "react";
import { Drawer, List, ListItem, ListItemIcon } from "@material-ui/core";
import { Inbox, Report } from "@material-ui/icons";

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