import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket";

const ROOMS = ["General", "Tech Support"];

function LiveRoom() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("General");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const handleConnect = () => {
      setConnectionStatus("Connected");
    };

    const handleDisconnect = () => {
      setConnectionStatus("Disconnected");
      setJoined(false);
    };

    const handleRoomJoined = ({ username: joinedUsername, room: joinedRoom }) => {
      setJoined(true);
      setUsername(joinedUsername);
      setRoom(joinedRoom);
    };

    const handleMessage = (payload) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        payload,
      ]);
    };

    const handleTyping = ({ username: typingUsername }) => {
      setTypingUser(typingUsername);
    };

    const handleStopTyping = () => {
      setTypingUser("");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room-joined", handleRoomJoined);
    socket.on("chat-message", handleMessage);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room-joined", handleRoomJoined);
      socket.off("chat-message", handleMessage);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const joinRoom = (event) => {
    event.preventDefault();

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", {
      username: cleanUsername,
      room,
    });
  };

  const sendMessage = (event) => {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || !joined) {
      return;
    }

    socket.emit("chat-message", {
      username,
      message: cleanMessage,
      room,
    });

    setMessage("");
    socket.emit("stop-typing", {
      username,
      room,
    });
  };

  const handleMessageChange = (event) => {
    const value = event.target.value;

    setMessage(value);

    if (!joined) {
      return;
    }

    if (value.trim()) {
      socket.emit("typing", {
        username,
        room,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", {
          username,
          room,
        });
      }, 1000);
    } else {
      socket.emit("stop-typing", {
        username,
        room,
      });
    }
  };

  const changeRoom = (event) => {
    const newRoom = event.target.value;

    if (joined) {
      socket.emit("join-room", {
        username,
        room: newRoom,
      });

      setMessages([]);
      setTypingUser("");
    }

    setRoom(newRoom);
  };

  const leaveRoom = () => {
    socket.disconnect();
    setJoined(false);
    setMessages([]);
    setTypingUser("");
    setConnectionStatus("Disconnected");
  };

  return (
    <main className="live-room">
      <div className="live-room-card">
        <div className="live-room-header">
          <div>
            <p className="live-room-eyebrow">REAL-TIME COMMUNICATION</p>
            <h1>Live Room</h1>
            <p>
              Chat instantly with other connected users using Socket.io.
            </p>
          </div>

          <span
            className={`connection-status ${
              connectionStatus === "Connected" ? "connected" : "disconnected"
            }`}
          >
            {connectionStatus}
          </span>
        </div>

        {!joined ? (
          <form className="join-form" onSubmit={joinRoom}>
            <label htmlFor="username">Your identifier</label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your name"
              maxLength={30}
              required
            />

            <label htmlFor="room">Choose a room</label>

            <select
              id="room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
            >
              {ROOMS.map((roomName) => (
                <option key={roomName} value={roomName}>
                  {roomName}
                </option>
              ))}
            </select>

            <button type="submit">Join Room</button>
          </form>
        ) : (
          <>
            <div className="room-controls">
              <div>
                <strong>{username}</strong>
                <span> • {room}</span>
              </div>

              <select value={room} onChange={changeRoom}>
                {ROOMS.map((roomName) => (
                  <option key={roomName} value={roomName}>
                    {roomName}
                  </option>
                ))}
              </select>

              <button type="button" onClick={leaveRoom}>
                Leave
              </button>
            </div>

            <div className="messages-container">
              {messages.length === 0 ? (
                <p className="empty-messages">
                  No messages yet. Send the first message!
                </p>
              ) : (
                messages.map((item, index) => (
                  <div className="chat-message" key={`${item.timestamp}-${index}`}>
                    <strong>[{item.username}]</strong>
                    <span>: {item.message}</span>
                  </div>
                ))
              )}
            </div>

            <div className="typing-area">
              {typingUser && typingUser !== username && (
                <span>{typingUser} is typing...</span>
              )}
            </div>

            <form className="message-form" onSubmit={sendMessage}>
              <input
                type="text"
                value={message}
                onChange={handleMessageChange}
                placeholder={`Message ${room}...`}
                maxLength={500}
              />

              <button type="submit">Send</button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default LiveRoom;