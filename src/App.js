import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, MessageCircle, Users, Settings, LogOut, Send, Radio } from 'lucide-react';
import './App.css';

const RadioApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [listenerCount, setListenerCount] = useState(42);
  
  const [messages, setMessages] = useState([
    { id: 1, user: '관리자', message: '안녕하세요! 방송에 오신 것을 환영합니다.', type: 'admin', timestamp: new Date() },
    { id: 2, user: '리스너1', message: '안녕하세요!', type: 'user', timestamp: new Date() },
    { id: 3, user: '리스너2', message: '좋은 음악 들려주세요~', type: 'user', timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogin = (email, password) => {
    if (email && password) {
      setIsLoggedIn(true);
      setUser({ email, nickname: email.split('@')[0], isPremium: true });
      setCurrentScreen('main');
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  const toggleMute = () => setIsMuted(!isMuted);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: user.nickname,
        message: newMessage,
        type: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    if (currentScreen === 'chat') setUnreadCount(0);
  }, [currentScreen]);

  const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="screen login-screen">
        <div className="login-container">
          <div className="logo-section">
            <div className="logo">
              <Radio size={40} />
            </div>
            <h1>라디오 방송</h1>
            <p>로그인하여 방송을 들어보세요</p>
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <button
              onClick={() => handleLogin(email, password)}
              className="login-button"
            >
              로그인
            </button>
          </div>
          <div className="demo-info">
            <p>데모 계정: demo@radio.com / demo123</p>
          </div>
        </div>
      </div>
    );
  };

  const MainScreen = () => (
    <div className="screen main-screen">
      <header className="app-header">
        <div className="header-left">
          <Radio size={32} />
          <div>
            <h1>라디오 방송</h1>
            <div className="status-info">
              <span className={`status-dot ${isLive ? 'live' : 'offline'}`}></span>
              <span>{isLive ? 'LIVE' : 'OFFLINE'}</span>
              <span>•</span>
              <span>{listenerCount}명 청취 중</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button onClick={() => setCurrentScreen('chat')} className="icon-button">
            <MessageCircle size={24} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          <button onClick={() => setCurrentScreen('settings')} className="icon-button">
            <Settings size={24} />
          </button>
        </div>
      </header>

      <div className="player-container">
        <div className="player-card">
          <div className="album-art">
            <Radio size={80} />
          </div>
          <div className="track-info">
            <h2>{isPlaying ? '방송 중' : '일시 정지'}</h2>
            <p>실시간 라디오 스트리밍</p>
          </div>
          <div className="player-controls">
            <button
              onClick={togglePlay}
              className={`play-button ${isPlaying ? 'playing' : 'paused'}`}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
          </div>
          <div className="volume-control">
            <button onClick={toggleMute}>
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className="volume-slider"
            />
            <span className="volume-value">{isMuted ? 0 : volume}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ChatScreen = () => (
    <div className="screen chat-screen">
      <header className="app-header">
        <button onClick={() => setCurrentScreen('main')} className="back-button">
          ← 뒤로
        </button>
        <h1>실시간 채팅</h1>
        <div className="user-count">
          <Users size={16} />
          <span>{listenerCount}</span>
        </div>
      </header>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type === 'admin' ? 'admin-message' : 'user-message'}`}>
            <div className="message-header">
              <span className="message-user">
                {msg.user}
                {msg.type === 'admin' && <span className="admin-badge">관리자</span>}
              </span>
              <span className="message-time">{msg.timestamp.toLocaleTimeString()}</span>
            </div>
            <p className="message-text">{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..."
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">
          <Send size={20} />
        </button>
      </div>
    </div>
  );

  const SettingsScreen = () => (
    <div className="screen settings-screen">
      <header className="app-header">
        <button onClick={() => setCurrentScreen('main')} className="back-button">
          ← 뒤로
        </button>
        <h1>설정</h1>
      </header>
      <div className="settings-content">
        <div className="settings-section">
          <h2>계정 정보</h2>
          <div className="settings-item">
            <span>이메일</span>
            <span>{user?.email}</span>
          </div>
          <div className="settings-item">
            <span>닉네임</span>
            <span>{user?.nickname}</span>
          </div>
          <div className="settings-item">
            <span>멤버십</span>
            <span className={user?.isPremium ? 'premium' : 'basic'}>
              {user?.isPremium ? '프리미엄' : '일반'}
            </span>
          </div>
        </div>
        <div className="settings-section">
          <h2>오디오 설정</h2>
          <div className="settings-item">
            <span>기본 볼륨</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className="volume-slider"
            />
          </div>
          <div className="settings-item">
            <span>자동 재생</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
        <button
          onClick={() => {
            setIsLoggedIn(false);
            setCurrentScreen('login');
            setUser(null);
          }}
          className="logout-button"
        >
          <LogOut size={20} />
          로그아웃
        </button>
      </div>
    </div>
  );

  if (!isLoggedIn) return <LoginScreen />;

  switch (currentScreen) {
    case 'main': return <MainScreen />;
    case 'chat': return <ChatScreen />;
    case 'settings': return <SettingsScreen />;
    default: return <MainScreen />;
  }
};

export default RadioApp;