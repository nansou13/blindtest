import React, { useEffect, useState } from 'react';
import {updateMessageList, sendMessage} from '../../socket'



const Tchat = ({username}) => {
    // let messageListing = []
    const [messageListing, setMessage] = useState([]);
    const [messagesend, setmessagesend] = useState('')
   
    const updateMessage = (messageInfo) => {
        console.log('-->-',messageInfo)
        setMessage(messageListing => [...messageListing, messageInfo])
    }

    const handleMessage = ({target: {value}}) => {
        setmessagesend(value)
      }
    
      const clickSendMessage = () => {
          console.log('send', messagesend)
        if(messagesend !== ''){
            sendMessage('messageUser', {message : {user: username, text : messagesend}})
            setmessagesend('')
        }
      }

    useEffect(() => {
        updateMessageList(updateMessage)
    }, []); // N’exécute l’effet que si count a changé
    
    return (
        <div style={{width: '100%'}}>
            <div>Tchat</div>
            <div>
                {messageListing && messageListing.length > 0 && messageListing.map((line) => (<Message value={line} />))}
            </div>
            <div>
                <input value={messagesend} type="text" onChange={handleMessage} onKeyDown={({key}) => key === 'Enter' && clickSendMessage()}/>
                <button onClick={clickSendMessage}>Valider</button>
            </div>
        </div>
    )
}

const Message = ({value}) => {
    return(<div>{value.user && `${value.user} : `} {value.text}</div>)
}

export default Tchat;