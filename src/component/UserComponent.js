import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button, message, Popconfirm, Switch } from 'antd';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { blue } from '@mui/material/colors';
import UpdateIcon from '@mui/icons-material/Update';
import ChangePasswordComponent from './ChangePasswordComponent';
import CancelIcon from '@mui/icons-material/Cancel';

import PropTypes from 'prop-types';
import Popper from '@mui/material/Popper';
import { useSpring, animated } from '@react-spring/web';

const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && onEnter) {
          onEnter();
        }
      },
      onRest: () => {
        if (!open && onExited) {
          onExited();
        }
      },
    });
  
    return (
      <animated.div ref={ref} style={style} {...other}>
        {children}
      </animated.div>
    );
});
  
Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

export default function UserComponent() {
    const [openPopper, setOpenPopper] = useState(false); 
    const [showPassword, setShowPassword] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [condition, setCondition] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openCloseConfirm, setOpenCloseConfirm] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState(''); // State to store the email value

    useEffect(() => {
        // Load the user email from local storage when the component mounts
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const changeCondition = (checked) => {
        setCondition(checked);
    };

    const confirm = () => {
        setOpenConfirm(false);
        message.success('Update done.');
    };

    const cancel = () => {
        setOpenConfirm(false);
        message.error('Click on cancel.');
    };

    const handleOpenChange = (newOpen) => {
        if (!newOpen) {
            setOpenConfirm(newOpen);
            return;
        }
        if (condition) {
            confirm(); 
        } else {
            setOpenConfirm(newOpen);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false); // This directly closes the modal without refresh
    };

    const handleCloseConfirm = () => {
        setOpenCloseConfirm(false);
        setOpenModal(false); // Close the modal after confirmation
    };

    const handleCancelClose = () => {
        setOpenCloseConfirm(false); // Cancel closing the modal if the user clicks "No"
    };

    // Popper toggle logic
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickPopper = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenPopper((previousOpen) => !previousOpen);
    };

    const canBeOpen = openPopper && Boolean(anchorEl);
    const id = canBeOpen ? 'spring-popper' : undefined;

    // // Update button click logic
    // const handleUpdateClick = () => {
    //     console.log("Update clicked");
    //     setOpenConfirm(true); // This triggers the confirmation pop-up
    // };

    const handleUpdateClick = async () => {
        try {
            const response = await fetch('http://localhost:8000/update', {  // Replace with your backend URL
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name })
            });
            const data = await response.json();

            if (response.ok) {
                message.success(data.message);
                localStorage.setItem('userName', data.name); 
                window.location.reload();
                setOpenConfirm(false);
            } else {
                message.error(data.detail || 'Update failed');
            }
        } catch (error) {
            message.error('An error occurred during the update');
            console.error(error);
        }
    };

    return (
        <div>
            <div className="w-auto flex items-end justify-end pr-4">
                <Button variant="contained" type="button" onClick={handleOpenModal} className="w-auto bg-sky-950 text-slate-50">
                    Change Password
                </Button>
            </div>

            {openModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                        onClick={handleCloseModal} // Clicking the overlay closes the modal
                    ></div>
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the box
                    >
                        <Box
                            sx={{ border: 1, p: 2, bgcolor: 'background.paper', zIndex: 60 }}
                            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the box
                            className="relative" // For positioning the close button
                        >
                            {/* Close Button in Top Right Corner */}
                            <CancelIcon
                                onClick={handleCloseModal}
                                className="absolute top-2 right-2"
                                style={{ color: 'orange',cursor: 'pointer'  }}
                            >
                                &#10005; {/* Unicode cross mark */}
                            </CancelIcon>

                            <ChangePasswordComponent />
                            <Popconfirm
                                title="Are you sure you want to close?"
                                open={openCloseConfirm}
                                onConfirm={handleCloseConfirm}
                                onCancel={handleCancelClose}
                                okText="Yes"
                                cancelText="No"
                                overlayStyle={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',  // Ensure the popup is centered
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: '#fff',
                                    padding: '20px', // Add some padding to make it visually clear
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                }}
                            ></Popconfirm>
                        </Box>
                    </div>
                </>
            )}
            <div className="flex items-center justify-center pl-2 space-x-4 space-y-4">
                <div className="flex flex-col items-start justify-start space-y-4 w-auto">
                    <div className="space-4 flex flex-col items-center justify-center w-auto mb-4 ml-16">
                        <style>
                            {`
                                @keyframes rotate {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}
                        </style>
                        <div
                            className="bg-blue-600 w-12 h-12 flex items-center justify-center rounded-full"
                            style={{
                                animation: 'rotate 4s linear infinite', 
                            }}
                        >
                            <AccountCircleIcon className="text-indigo-50" />
                        </div>

                        <h2 className="pb-2 w-auto">Welcome, update your profile</h2>
                    </div>

                    <div className="space-x-4">
                        <label className="flex items-center justify-center space-4">
                            <Avatar alt="Remy Sharp" sx={{ bgcolor: blue[600] }}>
                                <EmailIcon />
                            </Avatar>
                            <span className="ml-2 text-2xl font-mono text-sky-900 mr-16">email</span>
                            <TextField
                                className="w-96 ml-2"
                                id="outlined-email"
                                label="Email"
                                placeholder="example@domain.com"
                                variant="outlined"
                                value={email} // Set the value from localStorage
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    readOnly: true, // Make the TextField non-editable
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </label>
                    </div>

                    <div className="space-x-4">
                        <label className="flex items-center justify-center space-4">
                            <Avatar alt="Remy Sharp" sx={{ bgcolor: blue[600] }}>
                                <SupervisedUserCircleIcon />
                            </Avatar>
                            <span className="ml-2 text-2xl font-mono text-sky-900 mr-2 w-32">user name</span>
                            <TextField
                                className="w-96"
                                id="outlined-username"
                                label="Username"
                                placeholder="Username"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </label>
                    </div>
                    <div className="space-x-4 w-96 flex items-center justify-center ml-20">
                        <style>
                            {`
                                .button-with-icon {
                                    position: relative;
                                }

                                .update-icon {
                                    transition: transform 0.5s ease;
                                }

                                .button-with-icon:hover .update-icon {
                                    transform: rotate(360deg);
                                }
                            `}
                        </style>

                        <Popconfirm
                            title="Are you sure to update?"
                            description="Confirm your update"
                            open={openConfirm}
                            onOpenChange={handleOpenChange}
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="primary"
                                variant="contained"
                                className="w-96 bg-blue-500 button-with-icon h-8.5"
                                onClick={handleUpdateClick} 
                            >
                                <span className="update-icon text-white text-xl font-mono"><UpdateIcon /></span>
                                <span className="ml-2 text-white text-xl font-mono">Update</span>
                            </Button>
                        </Popconfirm>
                    </div>
                </div>
            </div>
        </div>
    );
}
