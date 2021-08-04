import React, { useEffect, useState } from 'react';
import { Card, CardContent, Button, CardMedia, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import "bootstrap/dist/css/bootstrap.min.css";
import { COLORS } from '../constants/Colors';
import ClearIcon from '@material-ui/icons/Clear';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popup from 'reactjs-popup';
import { useDispatch, useSelector } from 'react-redux';
import ContactList from './ContactList';
import moment from 'moment';
import emailjs from 'emailjs-com'

export default function GroupCard(group) {
    const classes = useStyles();
    const date = new Date(group.date);
    const duration = moment.duration(date - date).asHours();
    const loggedIn = useSelector(state => state.user.loggedIn);
    const userData = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const months = ["JAN", 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    
        function sendEmail(e) {
        e.preventDefault();
        emailjs.sendForm('service_hix3o8o','template_p0j9wjm',e.target,'user_a564XBSBeNeDkGfhl5ozI').then (res => {
            console.log(res);
       }).catch(err => console.log(err));
    }

    return (
        <div>
            <Card className={classes.card}>
                <CardMedia component='img' src={group.img} style={{
                    height: '15em'
                }} />
                <CardContent className={classes.cardContent} >
                    <div className={classes.date}>
                        <Typography variant="h2" style={{ marginLeft: -10, color: COLORS.highlight, textAlign: "center" }}>{months[date.getMonth()]}</Typography>
                        <Typography style={{ marginLeft: -10, fontSize: 46, fontWeight: "700", color: COLORS.black, textAlign: "center" }}>{date.getDate()}</Typography>
                        <Typography style={{ marginLeft: -10, fontSize: 20, fontWeight: "700", color: COLORS.grey, textAlign: "center" }}>({date.getFullYear()})</Typography>
                    </div>
                    <div className={classes.details}>
                        <Typography variant="h2">{group.title}</Typography>
                        <Typography style={{ marginTop: 10 }}>{group.address}</Typography>

                        <div className="row no-gutters" style={{ marginTop: 10 }}>
                            <div className={classes.leaveButton}>
                            <Popup trigger={
                            <Button style={{
                                color: COLORS.highlight,
                                textAlign: 'center'
                            }}>
                                {"Invite Friends"}
                            </Button>} modal>
                                {close => (
                                    <span className={classes.modal} style={{                                        
                                    }}>
                                        <IconButton className={classes.close} onClick={close} style={{
                                            position: 'absolute',
                                            right: '20px',
                                            top: '-5rem',
                                            backgroundColor: COLORS.white
                                        }}>
                                            <ClearIcon />
                                        </IconButton>
                                        <div className="container"
                                        style={{
                                            padding: "2rem",
                                            width: '150%',
                                            backgroundColor: COLORS.white
                                        }}> 
                                            <form className="column" onSubmit={sendEmail} >
                                                <div class="form-group">
                                                <label>Name</label>
                                                <input type="text" name = "name" class="form-control" placeholder="Enter name"></input>
                                                </div>
                                                <div class="form-group">
                                                <label>Email address</label>
                                                <input type="email" name="friend_email" class="form-control"  placeholder="Enter email"></input>
                                                </div>
                                                <div class="form-group">
                                                <label>Message</label>
                                                <textarea class="form-control" name ="message" rows="4"></textarea>
                                                </div>
                                                <button type="submit" value = "send" class="btn btn-primary">Send</button>

                                                {/* <input type="hidden" name="group_title" value={group.title}/>
                                                <input type="hidden" name="group_address" value={group.address}/>
                                                <input type="hidden" name="group_month" value= {months[date.getMonth()]}/>
                                                <input type="hidden" name="group_date" value= {date.getDate()}/>
                                                <input type="hidden" name="group_year" value= {date.getFullYear()}/>
                                                <input type="hidden" name="user_name" value= {userData.data.username}/> */}
                                            </form>
                                        </div> 
                                    </span>
                                )}
                            </Popup>
                            </div>
                            <div className={classes.membersButton}>
                                <Popup trigger={<Button style={{
                                    color: COLORS.white,
                                    overlay: {
                                        background: "#FFFF00"
                                    }
                                }}>
                                    {"View Members"}
                                </Button>} modal>
                                    {close => (
                                        <span className={classes.modal} style={{
                                        }}>
                                            <IconButton className={classes.close} onClick={close} style={{
                                                position: 'absolute',
                                                right: '20px',
                                                top: '20px',
                                            }}>
                                                <ClearIcon />
                                            </IconButton>
                                            <ContactList name={group.title} id={group.id} />
                                        </span>
                                    )}
                                </Popup>
                            </div>
                        <div className={classes.moreButton}>
                            <IconButton style={{
                                color: COLORS.highlight,
                                backgroundColor: COLORS.white
                            }} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => 
                                {window.open("http://www.google.com/calendar/render?action=TEMPLATE&text=" + group.title + 
                                    "&dates=" + moment(date).format('YYYYMMDDTHHmmssZ') + "/" + moment(date).add(1, 'hours').format('YYYYMMDDTHHmmssZ') +
                                    "&location=" + group.address, "_blank");
                                    handleClose();}}>Add to Calendar</MenuItem>
                                <MenuItem onClick={() => {window.open(group.url)
                                    handleClose();}}>Purchase Tickets</MenuItem>
                                <MenuItem onClick={() => group.handleClickLeave(group.id)}>Leave Group</MenuItem>
                            </Menu>
                        </div>  
                        </div>
                        </div>
                </CardContent>
            </Card>
        </div>
    )
}

const useStyles = makeStyles({
    leaveButton: {
        padding: '0px 10px',
        borderStyle: "solid",
        borderColor: COLORS.highlight,
        borderWidth: 1,
        borderRadius: 4,
        position: 'absolute',
        bottom: '15px',
        left: '30px',
        width: '150px',
    },
    membersButton: {
        padding: '0px 4px',
        backgroundColor: COLORS.highlight,
        borderStyle: "solid",
        borderColor: COLORS.highlight,
        borderWidth: 1,
        borderRadius: 4,
        position: 'absolute',
        bottom: '15px',
        right: '30px',
        width: '150px',
    },
    moreButton: {
        padding: '0px 4px',
        position: 'absolute',
        top: '20px',
        right: '5%'
    },
    card: {
        position: 'relative',
        height: '30em',
        width: '24em'
    },
    addCalendarButton: {
        backgroundColor: COLORS.white,
        borderRadius: 4,
        padding: '3px 5px',
        position: 'absolute',
        top: '20px',
        left: '15px',
        'z-index': '1'
    },
    cardContent: {
        paddingTop: '30px',
        display: "flex",
        flexDirection: "row"
    },
    date: {
        alignText: "center",
        flex: 1,
        display: "flex",
        flexDirection: "column"
    },
    details: {
        textAlign: "left",
        flex: 3
    },
    modal: {
    }
});
