import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, theme } from 'antd';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { blue } from '@mui/material/colors';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UserComponent from '../../component/UserComponent';
import ReactTypingEffect from 'react-typing-effect';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export default function MainPage() {
  const [data, setData] = useState([]); // Stores the chat history with roles
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Chat');
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const [message, setMessage] = useState("");
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'Andrew John');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  const handleSend = async () => {
    setMessage("");
    if (message.trim()) {
      const userMessage = { role: 'user', content: message };
      setData(prevData => [...prevData, userMessage]);
      
      try {
        const response = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [userMessage] })
        });

        if (response.ok) {
          const responseData = await response.json();
          const botResponse = { role: 'bot', content: responseData.response };
          setData(prevData => [...prevData, botResponse]);
          setIsContentVisible(true);
        } else {
          console.error("Failed to send message:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }

      setMessage("");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const handleLogout = () => {
    localStorage.setItem('access_token', ''); 
    localStorage.setItem('userName','')
    localStorage.setItem('userEmail','')
    navigate('/');
  };
  return (
    <Layout className="h-screen w-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <div className="ml-1 mr-1 h-10 mt-2 mb-6 rounded-lg shadow-lg shadow-blue-500/50 bg-slate-700"></div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['Chat']}
          onClick={(e) => {
            if (e.key === 'logout') {
              handleLogout();
            } else {
              setSelectedMenu(e.key);
            }
          }}
          items={[
            { key: 'Chat', icon: <MarkUnreadChatAltIcon />, label: 'Chat' },
            { key: 'User', icon: <UserOutlined />, label: 'User' },
            { key: 'logout', icon: <LogoutIcon />, label: 'logout' },
          ]}
        />

        <div className="absolute bottom-0 mb-4 ml-4 flex items-center space-x-4">
          <Avatar sx={{ bgcolor: blue[600] }}>
            <SupervisedUserCircleIcon />
          </Avatar>
          {!collapsed && <span className="text-gray-50">{userName}</span>}
          </div>
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          {selectedMenu !== 'User' && (
            <RateReviewIcon 
            className='mb-2 cursor-pointer' 
            onClick={() => {
              setIsContentVisible(false);
              setData([]);  
              setMessage('');  
            }} 
            
          />
          
          
          )}
          
        </Header>

        <Content
          style={{
            margin: '20px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {selectedMenu === 'User' ? (
            <UserComponent />
          ) : (
            <div className="flex items-center justify-center ">
              <ReactTypingEffect
                text="What can I help with?"
                speed={100}
                eraseDelay={999999999}
                typingDelay={500}
                repeat={0}
                className='text-5xl'
                cursor=' '
              />
            </div>
          )}

          {selectedMenu !== 'User' && (
            <div className='snap-y h-96 overflow-y-auto custom-scrollbar bg-gray-50 p-4'>
              <style>
                {`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: white;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: white;
                    border-radius: 10px;
                    border: 2px solid white;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: white;
                }`
                }
              </style>

              {data.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  {msg.role === 'bot' && <Avatar className="mr-2" alt="Bot" src="/static/images/avatar/1.jpg" />}
                  <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} max-w-[70%]`}>
                    <div className="flex justify-between">
                      <div className=" font-medium mt-1">
                        {msg.content.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                      {msg.role === 'bot' && (
                        <Tooltip title="Copy to clipboard">
                          <IconButton onClick={() => copyToClipboard(msg.content)} color="primary">
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Content>

        {selectedMenu === 'Chat' && (
          <div className="w-auto pl-6 pr-6 pb-2">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSend}
                      edge="end"
                      color="primary"
                      disabled={!message.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: "#f5f5f5",
                  borderRadius: 8,
                },
              }}
            />
          </div>
        )}
      </Layout>
    </Layout>
  );
}
