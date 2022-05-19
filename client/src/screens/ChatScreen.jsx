import React, {useState, useEffect, useRef} from "react";
import {useNavigate } from "react-router-dom";
import {connect} from 'react-redux';
import {io} from 'socket.io-client'
import chatService from "../services/chatService";

const {getChatroom, sendMessage: sendMess} = chatService;

const ChatRoom = ({authenticateReducer, groupOrderReducer}) => {
    const [messages, setMessages] = useState([]);
    const {chatroomId} = groupOrderReducer;
    const [content, setContent] = useState("");
    const messRef = useRef();


    const {account, token} = authenticateReducer;

    const loadChatroom = async() => {
        const response = await getChatroom(token, chatroomId);
        setMessages(response?.data.messages);
    }

    // const socket = io('http://localhost:9999')
    const socket = io(window.location.origin);

    useEffect(() => {
        loadChatroom();
    }, [])

    useEffect(() => {
      
      messRef?.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages])

    socket.on('message-received', (messages) => {
      setMessages(messages);
    })
   

    const onChange = e => {
        setContent(e.target.value);
    }

    const submit = () => {
        const emitObject = {
            senderId: account._id,
            content: content,
            chatroomId: chatroomId
        }
        socket.emit('message-sent', emitObject);
        setContent('')
    }
    return (

        <div className="container mx-auto my-20">
            <div className="w-full border rounded">
                <div className="h-full">
                    <div className="w-full">
                        <div className="relative flex items-center p-3 border-b border-gray-300">
                            <span className="block ml-2 font-bold text-gray-600">Your Group </span>
                        </div>
                        <div className="relative w-full p-6 overflow-y-auto h-96">
                            <ul className="space-y-2">
                                {messages?.map(message => message?.sender._id !== account._id ? <li key={message._id} className="flex justify-start">
                                    <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                                    <span className="block  font-medium">{message.sender.fullname}</span>
                                        <span className="block" ref={messRef}>{message.content}</span>
                                    </div>
                                </li> : <li  key={message._id} className="flex justify-end">
                                    <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                                        <span className="block font-medium">{message.sender.fullname}</span>
                                        <span className="block" ref={messRef}>{message.content}</span>
                                    </div>
                                </li>)}  
                            </ul>
                        </div>
                        <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                            <input type="text" onChange={onChange} value={content} placeholder="Message"
                                className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                                name="message" required />
                            <button type="submit" onClick={submit}>
                                <svg className="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

const mapStateToProps = state => {
    return {
        authenticateReducer: state.authenticateReducer,
        groupOrderReducer: state.groupOrderReducer,
    }
}

export default connect(mapStateToProps)(ChatRoom)