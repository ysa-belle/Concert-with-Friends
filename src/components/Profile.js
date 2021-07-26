import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import MailRoundedIcon from '@material-ui/icons/MailRounded';
import MusicNoteRoundedIcon from '@material-ui/icons/MusicNoteRounded';
import PhoneRoundedIcon from '@material-ui/icons/PhoneRounded';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import { Avatar } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '../constants/Colors';

import { userActions } from '../actions/user.actions';
import { alertActions } from '../actions/alert.actions';

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  avatarImage: {
    margin: "5% 0 5% 50%",
    width: "50px",
    height: "50px"
  },
  txtInput: {
		backgroundColor: "white",
		borderRadius: 4,
		border: "none",
	},
  editBtn: {
    backgroundColor: COLORS.grey,
    color: "white"
  }
}));

const musicTypes = [
  {
      label: "Hip-hop",
      value: "Hip-hop"
  },
  {
      label: "Pop",
      value: "Pop"
  },
  {
      label: "R&B",
      value: "R&B"
  },
  {
      label: "Rock'n'roll",
      value: "Rock'n'roll"
  },
  {
      label: "None of the above",
      value: "N/A"
  }
]

export default function Profile(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [editing, setEditing] = useState(null);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.user);
  const profile = userData && userData.data;
  const initialInputs = {
    username: {
      icon: <PersonRoundedIcon />,
      value: profile.username || '',
      validator: function (u) { return u !== "" },
      invalid: false
    },
    email: {
      icon: <MailRoundedIcon />,
      value: profile.email || '',
      validator: function (e) {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,4})*$/;
        return re.test(e);
      },
      invalid: false
    },
    phone: {
      icon: <PhoneRoundedIcon />,
      value: profile.phone || '',
      validator: function (p) {
        const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return re.test(p);
      },
      invalid: false
    },
    facebook: {
      icon: <FacebookIcon />,
      value: profile.facebook || '',
      validator: () => void(0),
      invalid: false
    },
    instagram: {
      icon: <InstagramIcon />,
      value: profile.instagram || '',
      validator: () => void(0),
      invalid: false
    },
    taste: {
      icon: <MusicNoteRoundedIcon />,
      value: profile.taste || '',
      validator: function (t) { return t !== "" },
      invalid: false
    }
  };

  const [profileInputs, setProfileInputs] = useState(initialInputs);

  const handleSaveProfile = () => {
    if (profile._id) {
      if (Object.values(profileInputs).some(elem => elem.invalid)) {
        dispatch(alertActions.error("Please fix the invalid inputs first!"))
        return;
      } else {
        const newInputs = Object.entries(profileInputs).map(([key, val]) => ({[key]: val.value}));
        dispatch(userActions.updateProfile(profile._id, newInputs.reduce((elem1, elem2) => {
          return Object.assign(elem1, elem2)
        }, {})
        ));
        setEditing(false);
        return;
      }
    }
  }

	const handleChange = (e, validateInput) => {
		const { name, value } = e.target;
    if (name === ("facebook" || "instagram") || validateInput(value)) {
      setProfileInputs(inputs => ({ ...inputs, [name]: {...inputs[[name]], "value" : value, "invalid": false }}));
    } else {
      setProfileInputs(inputs => ({ ...inputs, [name]: {...inputs[[name]], "value" : value, "invalid": true }}));
    }
	}

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={props.isOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={props.handleCloseProfile}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <Avatar className={classes.avatarImage} alt={profile?.username}></Avatar>
        <Divider />
        <List>
          {Object.entries(profileInputs).map(([key, text], index) => (
            <ListItem button key={index} alignItems="flex-start">
              <ListItemIcon>
                {text["icon"]}
              </ListItemIcon>
              <ListItemText primary={editing ? 
              <TextField
              disabled={key === "username"}
              error={text["invalid"]}
              helperText={text["invalid"] ? "Invalid entry" : null}
              className={classes.txtInput}
              name={key}
              size="small"
              variant="outlined"
              defaultValue={text["value"]}
              onChange={(e) => handleChange(e, text["validator"])}
              select={key === "taste"}
            >
            {key === "taste" ? musicTypes.map((option, idx) => (
              <MenuItem key={idx} value={option.value}>
                  {option.label}
              </MenuItem>
          )) : null}
          </TextField>
              : text["value"]} />
            </ListItem>
          ))}
        </List>
        {
          editing ? 
          <div>
          <Button onClick={handleSaveProfile} variant="contained" color="primary">
          Save
          </Button>
          <Button onClick={() => {
            setEditing(false);
            setProfileInputs(initialInputs);
            dispatch(alertActions.clear());
          }}>
          Cancel
          </Button>
          </div> :
          <div>
            <Button onClick={() => setEditing(true)} variant="contained" className={classes.editBtn}>
            Edit
            </Button>
          </div>
        }
      </Drawer>
    </div>
  );
}
