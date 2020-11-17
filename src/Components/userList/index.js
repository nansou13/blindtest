import React, { useEffect, useState } from 'react';
import { updateUserList } from '../../socket'

const UserList = () => {
    const [list, setList] = useState([]);
    const updateListUser = (values) => {
            setList(values)
    }
    useEffect(() => {
        updateUserList(updateListUser)
    }, []); // N’exécute l’effet que si count a changé
console.log(list)
    return (
        <div style={{width:200}}>
            <div>Liste des participants</div>
            <div>
                {list && list.length > 0 && list.map((user) => (<div>{user.name}</div>))}
            </div>
        </div>
    )
}

export default UserList;