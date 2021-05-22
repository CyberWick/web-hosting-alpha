import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import { List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';
import { Person } from '@material-ui/icons';

// const useStyles = makeStyles({
//   depositContext: {
//     flex: 1,
//   },
// });

export default function Deposits(props) {
  // const classes = useStyles();
  let peers = null;
  if(props.dbInfo.addrs.length > 0) {
    peers = props.dbInfo.addrs.map((item, index) => {
      // console.log(index, (item.substr(0, 40) + '&hellip;'));
      const ip = item.substr(0,20) + '...';
      return (
        <ListItem key={index}>
          
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <Tooltip title={item} placement='bottom' >
            <ListItemText
              primary={ip}
            />
          </Tooltip>
        </ListItem>
    )});
  }
  return (
    <React.Fragment>
      <Title>Hosting Peers</Title>
      <Typography component="p" variant="h6">
        Number of peers: {props.dbInfo.addrs.length}
      </Typography>
      <List>
        {peers}
      </List>
    </React.Fragment>
  );
}