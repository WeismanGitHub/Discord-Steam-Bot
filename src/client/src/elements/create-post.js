import { errorToast, successToast } from '../toasts'
import axios, * as others from 'axios'
import { useState } from "react";
import NavBar from './nav-bar';
import '../css/tickets.css';

export default function CreatePost() {
    const [title, setTitle] = useState('')
	const [text, setText] = useState(null)

    function createPost() {
        axios.post(`/api/v1/posts`, { title, text })
		.then(res => {
            successToast('Created post!')
        })
		.catch(err => errorToast(err?.response?.data?.error || err.message))
    }

    return (<>
        <NavBar/>

        <div class='ticket-area'>
            <div class='ticket-section'>
                <div class='ticket-title'>
                    <textarea
                        style={{ width: '75%', height: '15px' }}
                        class='ticket-response-input'
                        value={title}
                        onChange={(e)=> {
                            if (e.target.value.length > 256) {
                                return errorToast('Must be less than 256.')
                            }

                            setTitle(e.target.value)
                        }}
                    />
                </div>
                
                <br/>

                <textarea
                    style={{ width: '95%', height: '350px', marginBottom: '5px' }}
                    class='ticket-response-input'
                    value={text}
                    onChange={(e)=> {
                        if (e.target.value.length > 4096) {
                            return errorToast('Must be less than 4096.')
                        }

                        setText(e.target.value)
                    }}
                />
            </div>
            
            <br/>

            <button class='generic-button' onClick={createPost}>Post</button>
        </div>
    </>)
}